export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import { upsertSubscription, updateSubscriptionStatus } from '@/app/lib/db/subscriptions';
import { getPlanByPriceId } from '@/app/lib/plans';
import clientPromise from '@/app/lib/mongodb';
import Stripe from 'stripe';
import { sendWelcomeEmail, sendCancellationEmail } from '@/app/lib/email';

// ─── Idempotence ───────────────────────────────────────────────
// Stock eventId in MongoDB to ensure we process each Stripe event only once
async function isEventAlreadyProcessed(eventId: string): Promise<boolean> {
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection('stripe_events').findOne({ eventId });
  return !!existing;
}

async function markEventAsProcessed(eventId: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db();
  await db.collection('stripe_events').insertOne({
    eventId,
    processedAt: new Date(),
  });
}

// ─── Handlers by event ────────────────────────────────────────
// handleCheckoutCompleted
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;

  if (!userId || !planId) {
    console.error('[webhook] Missing metadata in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

  // update or insert subscription in DB
  await upsertSubscription({
    userId,
    email: session.customer_email ?? undefined,
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: subscription.id,
    plan: planId as 'starter' | 'pro' | 'expert',
    status: subscription.status as 'active' | 'trialing',
    currentPeriodEnd: new Date(
      (subscription.items.data[0] as unknown as { current_period_end: number }).current_period_end *
        1000
    ),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  sendWelcomeEmail({
    to: session.customer_email ?? '',
    planId,
  }).catch(console.error);

  console.log(`[webhook] Subscription activated for user ${userId} — plan ${planId}`);
}

// handleSubscriptionUpdated when user changes plan
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const priceId = subscription.items.data[0]?.price.id; //new plan priceId
  const plan = getPlanByPriceId(priceId);

  await upsertSubscription({
    userId: subscription.metadata?.userId ?? '',
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    plan: plan?.id ?? 'starter',
    status: subscription.status as 'active' | 'past_due' | 'canceled' | 'trialing',
    currentPeriodEnd: new Date(
      (subscription.items.data[0] as unknown as { current_period_end: number }).current_period_end *
        1000
    ),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  if (subscription.cancel_at_period_end) {
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    const email = 'email' in customer ? customer.email : null;

    if (email) {
      // Persist email so quota alerts can reach the user without Stripe calls
      await upsertSubscription({
        userId: subscription.metadata?.userId ?? '',
        email,
      });

      sendCancellationEmail({
        to: email,
        currentPeriodEnd: new Date(
          (subscription.items.data[0] as unknown as { current_period_end: number })
            .current_period_end * 1000
        ),
      }).catch(console.error);
    }
  }

  console.log(`[webhook] Subscription updated — ${subscription.id}`);
}

// handleSubscriptionDeleted when user cancels subscription
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  await updateSubscriptionStatus(subscription.id, 'canceled');
  console.log(`[webhook] Subscription canceled — ${subscription.id}`);
}

// handlePaymentFailed when payment fails, set subscription to past_due
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const subscriptionId = (invoice as unknown as { subscription: string }).subscription;
  if (!subscriptionId) return;

  await updateSubscriptionStatus(subscriptionId, 'past_due');
  console.log(`[webhook] Payment failed — ${subscriptionId}`);
}

// ─── Route  ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw body obligatoire
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  // Stripe signature verification

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!); //check signature and parse event
  } catch (err) {
    console.error('[webhook] Invalid signature:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Idempotence : check if event was already processed to avoid double

  const alreadyProcessed = await isEventAlreadyProcessed(event.id);
  if (alreadyProcessed) {
    console.log(`[webhook] Event already processed — ${event.id}`);
    return NextResponse.json({ received: true });
  }

  // Dispatch event to handler

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        // we log unhandled events but don't treat them as errors
        console.log(`[webhook] Unhandled event type — ${event.type}`);
    }

    //  Mark event as processed
    await markEventAsProcessed(event.id);

    // Stripe waits for a 200 response to consider the webhook delivered successfully. We respond as soon as possible
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhook] Handler error:', error);
    return NextResponse.json({ received: true }); // we still return 200 to avoid Stripe retrying, but we log the error for investigation
  }
}

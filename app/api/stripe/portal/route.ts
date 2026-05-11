import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { stripe } from '@/app/lib/stripe';
import { getSubscription } from '@/app/lib/db/subscriptions';

export async function POST(req: NextRequest) {
  try {
    // check user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // catch userid from DB
    const subscription = await getSubscription(session.user.id);
    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
    }

    // create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXTAUTH_URL}/`,
    });

    // return portal URL to frontend
    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('[portal] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

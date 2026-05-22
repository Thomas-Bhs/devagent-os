import clientPromise from '@/app/lib/mongodb';
import { stripe } from '@/app/lib/stripe';

export async function deleteAllUserData(userId: string, stripeCustomerId?: string): Promise<void> {
  const client = await clientPromise;
  const db = client.db();

  // ── Delete MongoDB ────────────────────────────────────

  await Promise.all([
    db.collection('subscriptions').deleteMany({ userId }),
    db.collection('usage_tracking').deleteMany({ userId }),
    db.collection('conversations').deleteMany({ userId }),
    db.collection('token_stats').deleteMany({ userId }),
    db.collection('visitors').deleteMany({ userId }),
  ]);

  console.log(`[deleteUser] MongoDB data deleted for user ${userId}`);

  // ── delete Stripe ─────────────────────────────────────

  if (stripeCustomerId) {
    try {
      await stripe.customers.del(stripeCustomerId);
      console.log(`[deleteUser] Stripe customer deleted — ${stripeCustomerId}`);
    } catch (err) {
      console.error('[deleteUser] Stripe deletion error:', err);
    }
  }
}

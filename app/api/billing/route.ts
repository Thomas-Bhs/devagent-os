import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getSubscription, getOrCreateUsage } from '@/app/lib/db/subscriptions';
import { PLANS } from '@/app/lib/plans';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.email === process.env.ADMIN_EMAIL;

    if (isAdmin) {
      const usage = await getOrCreateUsage(session.user.id, 'expert');
      return NextResponse.json({
        plan: 'expert',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
        requestsUsed: usage.requestsUsed,
        requestsLimit: 999999,
      });
    }

    const userId = session.user.id;

    // fetch the subscription for the user
    const subscription = await getSubscription(userId);
    if (!subscription) {
      return NextResponse.json({ error: 'No subscription' }, { status: 404 });
    }

    // fetch the usage for the current subscription plan
    const usage = await getOrCreateUsage(userId, subscription.plan);

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      requestsUsed: usage.requestsUsed,
      requestsLimit: usage.requestsLimit,
    });
  } catch (error) {
    console.error('[billing] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

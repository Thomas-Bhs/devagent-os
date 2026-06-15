import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getSubscription, getOrCreateUsage, getOrCreateFreeUsage } from '@/app/lib/db/subscriptions';

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
        isAdmin: true,
      });
    }

    const userId = session.user.id;

    const subscription = await getSubscription(userId);

    // Free user — return free trial usage instead of 404
    if (!subscription) {
      const usage = await getOrCreateFreeUsage(userId);
      return NextResponse.json({
        plan: 'free',
        status: 'free',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        requestsUsed: usage.requestsUsed,
        requestsLimit: usage.requestsLimit,
        isAdmin: false,
      });
    }

    const usage = await getOrCreateUsage(userId, subscription.plan);

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      requestsUsed: usage.requestsUsed,
      requestsLimit: usage.requestsLimit,
      isAdmin: false,
    });
  } catch (error) {
    console.error('[billing] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import clientPromise from '@/app/lib/mongodb';
import { Subscription, UsageTracking, SubscriptionStatus } from '@/app/types/subscription';
import { getRequestsLimit } from '@/app/lib/plans';

// Helpers

const getDb = async () => {
  const client = await clientPromise;
  return client.db();
};

const getCurrentMonthYear = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Subscriptions

export async function upsertSubscription(
  data: Partial<Subscription> & { userId: string }
): Promise<void> {
  const db = await getDb();
  await db.collection('subscriptions').updateOne(
    { userId: data.userId },
    {
      $set: { ...data, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const db = await getDb();
  return db.collection<Subscription>('subscriptions').findOne({ userId });
}

export async function updateSubscriptionStatus(
  stripeSubscriptionId: string,
  status: SubscriptionStatus
): Promise<void> {
  const db = await getDb();
  await db
    .collection('subscriptions')
    .updateOne({ stripeSubscriptionId }, { $set: { status, updatedAt: new Date() } });
}

// Limit

export async function getOrCreateUsage(userId: string, planId?: string): Promise<UsageTracking> {
  const db = await getDb();
  const monthYear = getCurrentMonthYear();
  const limit = getRequestsLimit(planId ?? '');

  await db.collection('usage_tracking').updateOne(
    { userId, monthYear },
    {
      $setOnInsert: {
        userId,
        monthYear,
        requestsUsed: 0,
        requestsLimit: limit,
        resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      },
    },
    { upsert: true }
  );

  return db
    .collection<UsageTracking>('usage_tracking')
    .findOne({ userId, monthYear }) as Promise<UsageTracking>;
}

export async function incrementUsage(userId: string): Promise<boolean> {
  const db = await getDb();
  const monthYear = getCurrentMonthYear();

  const result = await db.collection('usage_tracking').findOneAndUpdate(
    {
      userId,
      monthYear,
      $expr: { $lt: ['$requestsUsed', '$requestsLimit'] },
    },
    { $inc: { requestsUsed: 1 } },
    { returnDocument: 'after' }
  );

  return result !== null;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  return sub?.status === 'active' || sub?.status === 'trialing';
}

import clientPromise from '@/app/lib/mongodb';
import { Subscription, UsageTracking, SubscriptionStatus } from '@/app/types/subscription';
import { getRequestsLimit, FREE_TRIAL_REQUESTS } from '@/app/lib/plans';
import { sendQuotaAlertEmail } from '@/app/lib/email';

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
  data: Partial<Subscription> & { userId: string; email?: string }
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

export async function getOrCreateFreeUsage(userId: string): Promise<UsageTracking> {
  const db = await getDb();
  await db.collection('usage_tracking').updateOne(
    { userId, monthYear: 'free-trial' },
    {
      $setOnInsert: {
        userId,
        monthYear: 'free-trial',
        requestsUsed: 0,
        requestsLimit: FREE_TRIAL_REQUESTS,
        resetDate: null,
      },
    },
    { upsert: true }
  );
  return db
    .collection<UsageTracking>('usage_tracking')
    .findOne({ userId, monthYear: 'free-trial' }) as Promise<UsageTracking>;
}

export async function incrementUsage(userId: string, overrideMonthYear?: string): Promise<boolean> {
  const db = await getDb();
  const monthYear = overrideMonthYear ?? getCurrentMonthYear();

  const result = await db.collection('usage_tracking').findOneAndUpdate(
    {
      userId,
      monthYear,
      $expr: { $lt: ['$requestsUsed', '$requestsLimit'] },
    },
    { $inc: { requestsUsed: 1 } },
    { returnDocument: 'after' }
  );
  // Alert at 80% — fire-and-forget, does not block the response
  if (result) {
    const { requestsUsed, requestsLimit, userId: uid } = result as unknown as UsageTracking;
    const percent = requestsUsed / requestsLimit;

    if (percent >= 0.8 && percent < 0.81) {
      db.collection('subscriptions')
        .findOne({ userId: uid })
        .then((sub) => {
          if (sub?.email && sub?.plan) {
            return sendQuotaAlertEmail({
              to: sub.email,
              requestsUsed,
              requestsLimit,
              planId: sub.plan,
            });
          }
        })
        .catch(console.error);
    }
  }

  return result !== null;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  return sub?.status === 'active' || sub?.status === 'trialing';
}

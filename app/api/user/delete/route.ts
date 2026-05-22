import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { getSubscription } from '@/app/lib/db/subscriptions';
import { deleteAllUserData } from '@/app/lib/db/deleteUser';

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const subscription = await getSubscription(userId);
    const stripeCustomerId = subscription?.stripeCustomerId;

    await deleteAllUserData(userId, stripeCustomerId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[user/delete] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

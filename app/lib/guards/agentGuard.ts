import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { NextResponse } from 'next/server'
import {
  getSubscription,
  getOrCreateUsage,
  incrementUsage,
} from '@/app/lib/db/subscriptions'
import { PLANS } from '@/app/lib/plans'
import { GuardResult } from '@/app/types/subscription'


function isAdmin(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL ?? ''
  return email === adminEmail
}


export async function checkAgentAccess(agentId: string): Promise<GuardResult> {
  // 1. Vérifier que l'user est connecté
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !session?.user?.id) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized — please sign in' },
        { status: 401 }
      ),
    }
  }

  const userId = session.user.id
  const userEmail = session.user.email

  // Bypass admin
  if (isAdmin(userEmail)) {
    return { authorized: true, userId }
  }

  // check user subscription
  const subscription = await getSubscription(userId)

  if (!subscription) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'No active subscription — please subscribe to use agents' },
        { status: 403 }
      ),
    }
  }

  // check subscription status
  const isActive =
    subscription.status === 'active' ||
    subscription.status === 'trialing' ||
    (subscription.status === 'canceled' &&
      subscription.currentPeriodEnd > new Date())// subscription still active until the end of the month

  if (!isActive) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Subscription inactive — please renew your plan' },
        { status: 403 }
      ),
    }
  }

  // check if agent is included in user's plan
  const plan = PLANS[subscription.plan]
  const agentName = agentId.charAt(0).toUpperCase() + agentId.slice(1)

  const hasAgentAccess = plan?.agents.some(
    (a) => a.toLowerCase() === agentId.toLowerCase() ||
           a.toLowerCase() === agentName.toLowerCase()
  )

  if (!hasAgentAccess) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: `Agent "${agentId}" not available in your ${subscription.plan} plan — please upgrade`,
        },
        { status: 403 }
      ),
    }
  }

  // cheks quota requests
  await getOrCreateUsage(userId, subscription.plan)
  const allowed = await incrementUsage(userId)

  if (!allowed) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: 'Monthly quota reached — resets on the 1st of next month',
        },
        { status: 429 }
      ),
    }
  }

  return { authorized: true, userId }
}
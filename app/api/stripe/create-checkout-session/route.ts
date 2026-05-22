import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/lib/auth'
import { stripe } from '@/app/lib/stripe'
import { PLANS } from '@/app/lib/plans'
import { PlanId } from '@/app/types/subscription'

export async function POST(req: NextRequest) {
  try {
    // Verif if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch the planId from the request body
    const body = await req.json()
    const { planId } = body as { planId: PlanId }

    const plan = PLANS[planId]
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    // create a checkout session with Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: session.user.email,

      // metadata and link between Stripe and mongoDB
      metadata: {
        userId: session.user.id ?? '',
        planId,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id ?? '',
          planId,
        },
      },

      //redirect URLs after checkout
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    })

    // Return the URL of the checkout session to the client
    return NextResponse.json({ url: checkoutSession.url })

  } catch (error) {
    console.error('[checkout-session] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
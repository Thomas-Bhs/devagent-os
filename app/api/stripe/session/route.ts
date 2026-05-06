import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      planId: session.metadata?.planId,
      customerEmail: session.customer_email,
    });
  } catch (error) {
    console.error('[stripe/session] Error:', error);
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }
}

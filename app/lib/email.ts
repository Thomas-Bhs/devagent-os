import { Resend } from 'resend';
import { render } from '@react-email/components';
import { PLANS } from '@/app/lib/plans';
import { WelcomeEmail } from '@/app/emails/WelcomeEmail';
import { QuotaAlertEmail } from '@/app/emails/QuotaAlertEmail';
import { CancellationEmail } from '@/app/emails/CancellationEmail';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';
const APP_URL = process.env.NEXTAUTH_URL ?? '';

export async function sendWelcomeEmail({
  to,
  planId,
}: {
  to: string;
  planId: string;
}): Promise<void> {
  const plan = PLANS[planId];
  if (!plan) return;

  const html = await render(
    WelcomeEmail({
      planName: plan.name,
      planPrice: plan.price,
      requestsPerMonth: plan.requestsPerMonth,
      agents: plan.agents,
      appUrl: APP_URL,
    })
  );

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to DevAgent OS — ${plan.name} plan activated`,
    html,
  });
}

export async function sendQuotaAlertEmail({
  to,
  requestsUsed,
  requestsLimit,
  planId,
}: {
  to: string;
  requestsUsed: number;
  requestsLimit: number;
  planId: string;
}): Promise<void> {
  const plan = PLANS[planId];
  const percent = Math.round((requestsUsed / requestsLimit) * 100);

  const html = await render(
    QuotaAlertEmail({
      percent,
      requestsUsed,
      requestsLimit,
      planName: plan?.name ?? planId,
      isExpert: planId === 'expert',
      appUrl: APP_URL,
    })
  );

  await resend.emails.send({
    from: FROM,
    to,
    subject: `DevAgent OS — You've used ${percent}% of your monthly quota`,
    html,
  });
}

export async function sendCancellationEmail({
  to,
  currentPeriodEnd,
}: {
  to: string;
  currentPeriodEnd: Date;
}): Promise<void> {
  const endDate = currentPeriodEnd.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = await render(CancellationEmail({ endDate, appUrl: APP_URL }));

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'DevAgent OS — Subscription canceled',
    html,
  });
}

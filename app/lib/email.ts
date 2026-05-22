import { Resend } from 'resend';
import { PLANS } from '@/app/lib/plans';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

// ─── Welcome email ─────────────────────────────────────────────

export async function sendWelcomeEmail({
  to,
  planId,
}: {
  to: string;
  planId: string;
}): Promise<void> {
  const plan = PLANS[planId];
  if (!plan) return;

  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to DevAgent OS — ${plan.name} plan activated`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #0f0f1a;">
          Welcome to DevAgent OS 👋
        </h1>
        <p style="color: #6b7280; margin-top: 16px;">
          Your <strong>${plan.name}</strong> plan is now active.
        </p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600;">Your plan</p>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0f0f1a;">${plan.name} — €${plan.price}/month</p>
          <p style="margin: 8px 0 0; color: #6b7280;">${plan.requestsPerMonth.toLocaleString()} requests / month</p>
        </div>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600;">Available agents</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${plan.agents
              .map(
                (agent) => `
              <span style="background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 4px 12px; font-size: 12px; color: #0f0f1a;">
                ${agent}
              </span>
            `
              )
              .join('')}
          </div>
        </div>

        
          href="${process.env.NEXTAUTH_URL}"
          style="display: inline-block; background: #0f0f1a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;"
        >
          Start using DevAgent OS →
        </a>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
          You can manage your subscription at any time from the app menu.
        </p>
      </div>
    `,
  });
}

// ─── Quota alert email ─────────────────────────────────────────

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
  const percent = Math.round((requestsUsed / requestsLimit) * 100);
  const plan = PLANS[planId];

  await resend.emails.send({
    from: FROM,
    to,
    subject: `DevAgent OS — You've used ${percent}% of your monthly quota`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #0f0f1a;">
          Quota alert ⚠️
        </h1>
        <p style="color: #6b7280; margin-top: 16px;">
          You've used <strong>${percent}%</strong> of your monthly quota on your <strong>${plan?.name}</strong> plan.
        </p>

        <div style="background: #fef9c3; border: 1px solid #fde68a; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; color: #92400e; font-weight: 600;">Usage</p>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0f0f1a;">
            ${requestsUsed.toLocaleString()} / ${requestsLimit.toLocaleString()} requests
          </p>
          <div style="background: #e5e7eb; border-radius: 999px; height: 8px; margin-top: 12px; overflow: hidden;">
            <div style="background: #f59e0b; height: 100%; width: ${percent}%; border-radius: 999px;"></div>
          </div>
        </div>

        <p style="color: #6b7280;">
          Your quota resets on the 1st of next month. Consider upgrading your plan for more requests.
        </p>

        
          href="${process.env.NEXTAUTH_URL}/billing"
          style="display: inline-block; background: #0f0f1a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;"
        >
          View billing →
        </a>

        ${
          plan?.id !== 'expert'
            ? `
          
            href="${process.env.NEXTAUTH_URL}/pricing"
            style="display: inline-block; background: transparent; color: #0f0f1a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px; margin-left: 8px; border: 1px solid #e5e7eb;"
          >
            Upgrade plan →
          </a>
        `
            : ''
        }
      </div>
    `,
  });
}

// ─── Cancellation email ────────────────────────────────────────

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

  await resend.emails.send({
    from: FROM,
    to,
    subject: 'DevAgent OS — Subscription canceled',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: bold; color: #0f0f1a;">
          Subscription canceled
        </h1>
        <p style="color: #6b7280; margin-top: 16px;">
          Your DevAgent OS subscription has been canceled.
        </p>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; color: #9ca3af; font-weight: 600;">Access until</p>
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #0f0f1a;">${endDate}</p>
          <p style="margin: 8px 0 0; color: #6b7280;">You can continue using DevAgent OS until this date.</p>
        </div>

        <p style="color: #6b7280;">
          Changed your mind? You can resubscribe at any time.
        </p>

        
          href="${process.env.NEXTAUTH_URL}/pricing"
          style="display: inline-block; background: #0f0f1a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 8px;"
        >
          Resubscribe →
        </a>

        <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">
          Thank you for using DevAgent OS.
        </p>
      </div>
    `,
  });
}

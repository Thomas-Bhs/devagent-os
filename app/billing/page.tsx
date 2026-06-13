'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useBilling } from '@/app/hooks/useBilling';
import { PLANS, FREE_AGENTS } from '@/app/lib/plans';
import { useState } from 'react';

export default function BillingPage() {
  const { t } = useTheme();
  const router = useRouter();
  const { billing, loading, error } = useBilling();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const isFree = billing?.plan === 'free';
  const plan = billing && !isFree ? PLANS[billing.plan] : null;
  const quotaPercent = billing
    ? Math.round((billing.requestsUsed / billing.requestsLimit) * 100)
    : 0;

  const renewalDate =
    billing?.currentPeriodEnd
      ? new Date(billing.currentPeriodEnd).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

  const handleManageSubscription = async () => {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const cardStyle = (key: string) => ({
    backgroundColor: t.cardBg,
    border: `1px solid ${t.cardBorder}`,
    transform: hoveredCard === key ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: hoveredCard === key ? t.pricingCardHoverShadow : 'none',
  });

  return (
    <main
      className='min-h-screen py-12 px-4'
      style={{ backgroundColor: t.bg, fontFamily: t.fontFamily }}
    >
      <div className='max-w-2xl mx-auto'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70'
          style={{ color: t.textSecondary }}
        >
          <ArrowLeft size={16} />
          {t.pricingGlowAnimation ? '< BACK_' : 'Back'}
        </button>

        <h1 className='text-2xl sm:text-3xl font-bold mb-8' style={{ color: t.text }}>
          {t.pricingGlowAnimation ? '>> BILLING_' : 'Billing & Subscription'}
        </h1>

        {loading && (
          <p
            className={t.pricingGlowAnimation ? 'fallout-blink' : ''}
            style={{ color: t.textSecondary }}
          >
            {t.pricingGlowAnimation ? 'LOADING...' : 'Loading...'}
          </p>
        )}

        {error && (
          <div
            className='rounded-xl p-4 mb-6'
            style={{ backgroundColor: t.subtleBg, border: `1px solid ${t.cardBorder}` }}
          >
            <p style={{ color: t.textSecondary }}>{error}</p>
            <button
              onClick={() => router.push('/pricing')}
              className='mt-3 text-sm font-semibold'
              style={{ color: t.accent }}
            >
              {t.pricingGlowAnimation ? 'VIEW PLANS_' : 'View plans →'}
            </button>
          </div>
        )}

        {/* ── Free plan ── */}
        {!loading && !error && billing && isFree && (
          <div className='flex flex-col gap-4'>
            <div
              onMouseEnter={() => setHoveredCard('plan')}
              onMouseLeave={() => setHoveredCard(null)}
              className='rounded-xl p-6 transition-all duration-200'
              style={cardStyle('plan')}
            >
              <p className='text-xs uppercase font-semibold mb-3' style={{ color: t.sectionLabelColor }}>
                {t.pricingGlowAnimation ? '>> CURRENT PLAN' : 'Current plan'}
              </p>
              <div className='flex items-center justify-between flex-wrap gap-3'>
                <div>
                  <p className='text-2xl font-bold' style={{ color: t.text }}>
                    {t.pricingGlowAnimation ? '>> FREE_' : 'Free'}
                  </p>
                  <p className='text-sm mt-1' style={{ color: t.textSecondary }}>
                    {t.pricingGlowAnimation ? 'NO ACTIVE SUBSCRIPTION' : 'No active subscription'}
                  </p>
                </div>
                <span
                  className='text-xs font-bold px-3 py-1.5 rounded-full uppercase'
                  style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                >
                  {t.pricingGlowAnimation ? 'FREE_' : 'Free'}
                </span>
              </div>
            </div>

            <div
              onMouseEnter={() => setHoveredCard('quota')}
              onMouseLeave={() => setHoveredCard(null)}
              className='rounded-xl p-6 transition-all duration-200'
              style={cardStyle('quota')}
            >
              <p className='text-xs uppercase font-semibold mb-3' style={{ color: t.sectionLabelColor }}>
                {t.pricingGlowAnimation ? '>> FREE TRIAL QUOTA' : 'Free trial quota'}
              </p>
              <div className='flex items-end justify-between mb-3'>
                <p className='text-2xl font-bold' style={{ color: t.text }}>
                  {billing.requestsUsed.toLocaleString()}
                  <span className='text-sm font-normal ml-1' style={{ color: t.textSecondary }}>
                    / {billing.requestsLimit.toLocaleString()}
                  </span>
                </p>
                <p className='text-sm font-semibold' style={{ color: quotaPercent >= 80 ? '#dc2626' : t.accent }}>
                  {quotaPercent}%
                </p>
              </div>
              <div className='w-full h-2 rounded-full overflow-hidden' style={{ backgroundColor: t.subtleBg }}>
                <div
                  className='h-full rounded-full transition-all duration-500'
                  style={{
                    width: `${Math.min(quotaPercent, 100)}%`,
                    backgroundColor: quotaPercent >= 80 ? '#dc2626' : quotaPercent >= 50 ? '#f59e0b' : t.accent,
                  }}
                />
              </div>
              <p className='text-xs mt-2' style={{ color: t.textSecondary }}>
                {t.pricingGlowAnimation
                  ? 'ONE-TIME TRIAL — NO MONTHLY RESET_'
                  : 'One-time trial — quota does not reset monthly.'}
              </p>
            </div>

            <div
              onMouseEnter={() => setHoveredCard('agents')}
              onMouseLeave={() => setHoveredCard(null)}
              className='rounded-xl p-6 transition-all duration-200'
              style={cardStyle('agents')}
            >
              <p className='text-xs uppercase font-semibold mb-3' style={{ color: t.sectionLabelColor }}>
                {t.pricingGlowAnimation ? '>> AVAILABLE AGENTS' : 'Available agents'}
              </p>
              <div className='flex flex-wrap gap-2 mb-3'>
                {FREE_AGENTS.map((id) => (
                  <span
                    key={id}
                    className='text-xs px-3 py-1.5 rounded-lg font-medium capitalize'
                    style={{ backgroundColor: t.pillBg, color: t.text, border: `1px solid ${t.cardBorder}` }}
                  >
                    {id === 'uiux' ? 'UI/UX' : id.charAt(0).toUpperCase() + id.slice(1)}
                  </span>
                ))}
              </div>
              <p className='text-xs' style={{ color: t.textSecondary }}>
                {t.pricingGlowAnimation
                  ? 'UI/UX, DESIGNER & ORCHESTRATOR REQUIRE A PAID PLAN_'
                  : 'UI/UX, Designer and Orchestrator require a paid plan.'}
              </p>
            </div>

            <button
              onClick={() => router.push('/pricing')}
              className='w-full py-3 rounded-xl font-semibold text-sm'
              style={{ backgroundColor: t.accent, color: t.bg }}
            >
              {t.pricingGlowAnimation ? 'VIEW PLANS_' : 'View plans →'}
            </button>
          </div>
        )}

        {/* ── Paid plan ── */}
        {!loading && !error && billing && plan && (
          <div className='flex flex-col gap-4'>
            <div
              onMouseEnter={() => setHoveredCard('plan')}
              onMouseLeave={() => setHoveredCard(null)}
              className='rounded-xl p-6 transition-all duration-200'
              style={cardStyle('plan')}
            >
              <p className='text-xs uppercase font-semibold mb-3' style={{ color: t.sectionLabelColor }}>
                {t.pricingGlowAnimation ? '>> CURRENT PLAN' : 'Current plan'}
              </p>
              <div className='flex items-center justify-between flex-wrap gap-3'>
                <div>
                  <p className='text-2xl font-bold' style={{ color: t.text }}>{plan.name}</p>
                  <p className='text-sm mt-1' style={{ color: t.textSecondary }}>€{plan.price} / month</p>
                </div>
                <span
                  className='text-xs font-bold px-3 py-1.5 rounded-full uppercase'
                  style={{
                    backgroundColor: billing.status === 'active' ? '#dcfce7' : billing.status === 'trialing' ? '#dbeafe' : '#fee2e2',
                    color: billing.status === 'active' ? '#16a34a' : billing.status === 'trialing' ? '#2563eb' : '#dc2626',
                  }}
                >
                  {billing.status}
                </span>
              </div>
              {renewalDate && (
                <p className='text-xs mt-4' style={{ color: t.textSecondary }}>
                  {billing.cancelAtPeriodEnd ? `Access until ${renewalDate}` : `Renews on ${renewalDate}`}
                </p>
              )}
            </div>

            <div
              onMouseEnter={() => setHoveredCard('quota')}
              onMouseLeave={() => setHoveredCard(null)}
              className='rounded-xl p-6 transition-all duration-200'
              style={cardStyle('quota')}
            >
              <p className='text-xs uppercase font-semibold mb-3' style={{ color: t.sectionLabelColor }}>
                {t.pricingGlowAnimation ? '>> MONTHLY QUOTA' : 'Monthly quota'}
              </p>
              <div className='flex items-end justify-between mb-3'>
                <p className='text-2xl font-bold' style={{ color: t.text }}>
                  {billing.requestsUsed.toLocaleString()}
                  <span className='text-sm font-normal ml-1' style={{ color: t.textSecondary }}>
                    / {billing.requestsLimit.toLocaleString()}
                  </span>
                </p>
                <p className='text-sm font-semibold' style={{ color: quotaPercent >= 80 ? '#dc2626' : t.accent }}>
                  {quotaPercent}%
                </p>
              </div>
              <div className='w-full h-2 rounded-full overflow-hidden' style={{ backgroundColor: t.subtleBg }}>
                <div
                  className='h-full rounded-full transition-all duration-500'
                  style={{
                    width: `${Math.min(quotaPercent, 100)}%`,
                    backgroundColor: quotaPercent >= 80 ? '#dc2626' : quotaPercent >= 50 ? '#f59e0b' : t.accent,
                  }}
                />
              </div>
              <p className='text-xs mt-2' style={{ color: t.textSecondary }}>
                {t.pricingGlowAnimation ? 'RESETS ON THE 1ST OF EACH MONTH' : 'Resets on the 1st of each month'}
              </p>
            </div>

            <div
              onMouseEnter={() => setHoveredCard('agents')}
              onMouseLeave={() => setHoveredCard(null)}
              className='rounded-xl p-6 transition-all duration-200'
              style={cardStyle('agents')}
            >
              <p className='text-xs uppercase font-semibold mb-3' style={{ color: t.sectionLabelColor }}>
                {t.pricingGlowAnimation ? '>> AVAILABLE AGENTS' : 'Available agents'}
              </p>
              <div className='flex flex-wrap gap-2'>
                {plan.agents.map((agent) => (
                  <span
                    key={agent}
                    className='text-xs px-3 py-1.5 rounded-lg font-medium'
                    style={{ backgroundColor: t.pillBg, color: t.text, border: `1px solid ${t.cardBorder}` }}
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                onClick={handleManageSubscription}
                onMouseEnter={() => setHoveredBtn('manage')}
                onMouseLeave={() => setHoveredBtn(null)}
                className='flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200'
                style={{
                  backgroundColor: hoveredBtn === 'manage' ? '#0f0f1a' : t.subtleBg,
                  color: hoveredBtn === 'manage' ? '#ffffff' : t.text,
                  border: `1px solid ${t.cardBorder}`,
                  transform: hoveredBtn === 'manage' ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: hoveredBtn === 'manage' ? t.pricingCardHoverShadow : 'none',
                }}
              >
                {t.pricingGlowAnimation ? 'MANAGE SUBSCRIPTION_' : 'Manage subscription'}
              </button>

              {billing.plan !== 'expert' && (
                <button
                  onClick={() => router.push('/pricing')}
                  onMouseEnter={() => setHoveredBtn('upgrade')}
                  onMouseLeave={() => setHoveredBtn(null)}
                  className='flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200'
                  style={{
                    backgroundColor: hoveredBtn === 'upgrade' ? '#0f0f1a' : t.subtleBg,
                    color: hoveredBtn === 'upgrade' ? '#ffffff' : t.text,
                    border: `1px solid ${t.cardBorder}`,
                    transform: hoveredBtn === 'upgrade' ? 'translateY(-2px)' : 'translateY(0)',
                    boxShadow: hoveredBtn === 'upgrade' ? t.pricingCardHoverShadow : 'none',
                  }}
                >
                  {t.pricingGlowAnimation ? 'UPGRADE PLAN_' : 'Upgrade plan →'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

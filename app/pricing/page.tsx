'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { PLANS } from '@/app/lib/plans';
import { PlanId } from '@/app/types/subscription';

export default function PricingPage() {
  const { t } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<PlanId | null>(null);

  const handleSubscribe = async (planId: PlanId) => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    try {
      setLoadingPlan(planId);
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (error) {
      console.error('[pricing] checkout error:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = Object.values(PLANS);

  return (
    <main
      className='min-h-screen py-16 px-4'
      style={{ backgroundColor: t.bg, fontFamily: t.fontFamily }}
    >
      <button
        onClick={() => router.back()}
        className='flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70'
        style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
      >
        <ArrowLeft size={16} />
        {t.pricingGlowAnimation ? '< BACK_' : 'Back'}
      </button>
      
      {/* Header */}
      <div className='text-center mb-12'>
        <h1
          className={`text-4xl font-bold mb-4 ${t.pricingGlowAnimation ? 'fallout-blink' : ''}`}
          style={{ color: t.text }}
        >
          {t.pricingTitle}
        </h1>
        <p className='text-lg max-w-xl mx-auto' style={{ color: t.textSecondary }}>
          {t.pricingSubtitle}
        </p>
      </div>

      {/* Cards */}
      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
        {plans.map((plan) => {
          const isHovered = hoveredPlan === plan.id;
          const isLoading = loadingPlan === plan.id;

          return (
            <div
              key={plan.id}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-xl p-6 flex flex-col gap-4 transition-all duration-200 ${
                t.pricingGlowAnimation && isHovered ? 'fallout-hover-card' : ''
              }`}
              style={{
                backgroundColor: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                transform:
                  !t.pricingGlowAnimation && isHovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: isHovered ? t.pricingCardHoverShadow : 'none',
              }}
            >
              {/* Badge Popular */}
              {plan.isPopular && (
                <div
                  className='absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold'
                  style={
                    t.pricingGlowAnimation
                      ? { backgroundColor: t.accent, color: t.bg }
                      : { backgroundColor: '#0f0f1a', color: '#ffffff' }
                  }
                >
                  {t.pricingPopularLabel}
                </div>
              )}

              {/* Plan name + price */}
              <div>
                <h2 className='text-xl font-bold' style={{ color: t.text }}>
                  {plan.name}
                </h2>
                <div className='mt-2 flex items-end gap-1'>
                  <span
                    className='text-4xl font-bold transition-all duration-200'
                    style={{
                      color: t.accent,
                      textShadow:
                        t.pricingGlowAnimation && isHovered ? `0 0 12px ${t.accent}` : 'none',
                    }}
                  >
                    €{plan.price}
                  </span>
                  <span className='text-sm mb-1' style={{ color: t.textSecondary }}>
                    / month
                  </span>
                </div>
              </div>

              {/* Agents */}
              <div>
                <p
                  className='text-xs font-semibold uppercase mb-2'
                  style={{ color: t.sectionLabelColor }}
                >
                  {t.pricingAgentsLabel}
                </p>
                <div className='flex flex-wrap gap-2'>
                  {plan.agents.map((agent) => (
                    <span
                      key={agent}
                      className='text-xs px-2 py-1 rounded transition-all duration-150'
                      style={{
                        backgroundColor: t.pillBg,
                        color: t.text,
                        border: `1px solid ${t.cardBorder}`,
                      }}
                    >
                      {agent}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <ul className='flex flex-col gap-2 flex-1'>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className='flex items-center gap-2 text-sm'
                    style={{ color: t.textSecondary }}
                  >
                    <span
                      className={t.pricingGlowAnimation ? 'fallout-blink' : ''}
                      style={{ color: t.accent }}
                    >
                      {t.pricingCheckIcon}
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPlan !== null}
                className='w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200'
                style={{
                  backgroundColor: t.subtleBg,
                  color: t.text,
                  border: `1px solid ${isHovered ? t.accent : t.cardBorder}`,
                  opacity: loadingPlan !== null ? 0.6 : 1,
                  cursor: loadingPlan !== null ? 'not-allowed' : 'pointer',
                  boxShadow:
                    t.pricingGlowAnimation && isHovered ? `0 0 16px ${t.accent}60` : 'none',
                }}
              >
                {isLoading ? t.pricingCtaLoadingLabel : t.pricingCtaLabel}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <p className='text-center text-xs mt-10' style={{ color: t.textSecondary }}>
        {t.pricingFooterNote}
      </p>
    </main>
  );
}

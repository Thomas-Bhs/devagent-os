'use client';

import { useTheme } from '@/app/context/ThemeContext';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const { t } = useTheme();
  const router = useRouter();

  return (
    <main
      className='min-h-screen flex flex-col items-center justify-center px-4'
      style={{ backgroundColor: t.bg, fontFamily: t.fontFamily }}
    >
      <div
        className='max-w-md w-full rounded-xl p-8 text-center flex flex-col gap-6'
        style={{
          backgroundColor: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
        }}
      >
        {/* Icon */}
        <div className='text-4xl mx-auto' style={{ color: t.textSecondary }}>
          {t.pricingGlowAnimation ? '[ X ]' : '✕'}
        </div>

        {/* Title */}
        <h1 className='text-2xl font-bold' style={{ color: t.text }}>
          {t.pricingGlowAnimation ? '>> SUBSCRIPTION CANCELED <<' : 'Payment canceled'}
        </h1>

        {/* Message */}
        <p style={{ color: t.textSecondary }}>
          {t.pricingGlowAnimation
            ? 'NO CHARGES HAVE BEEN MADE. RETURN TO SELECT A PLAN.'
            : "No charges were made. You can go back and choose a plan whenever you're ready."}
        </p>

        {/* Bouton */}
        <button
          onClick={() => router.push('/pricing')}
          className='w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200'
          style={{
            backgroundColor: t.accent,
            color: t.bg,
          }}
        >
          {t.pricingGlowAnimation ? 'RETURN TO PLANS' : 'Back to pricing'}
        </button>
      </div>
    </main>
  );
}

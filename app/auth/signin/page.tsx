'use client';

import { signIn } from 'next-auth/react';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';

export default function SignInPage() {
  const { t } = useTheme();

  return (
    <div className='min-h-screen flex items-center justify-center' style={{ background: t.bg }}>
      <div
        className='w-full max-w-sm p-8 rounded-3xl shadow-sm'
        style={{
          background: t.surface,
          border: `1px solid ${t.border}`,
        }}
      >
        <div className='flex flex-col items-center gap-6'>
          <div
            className='w-14 h-14 rounded-2xl flex items-center justify-center'
            style={{ background: t.accent }}
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <rect x='3' y='3' width='8' height='8' rx='2' fill={t.bg} />
              <rect x='13' y='3' width='8' height='8' rx='2' fill={t.bg} fillOpacity='0.5' />
              <rect x='3' y='13' width='8' height='8' rx='2' fill={t.bg} fillOpacity='0.5' />
              <rect x='13' y='13' width='8' height='8' rx='2' fill={t.bg} fillOpacity='0.3' />
            </svg>
          </div>

          <div className='text-center'>
            <h1
              className='text-lg font-bold mb-1'
              style={{ color: t.highlightColor, fontFamily: t.fontFamily }}
            >
              {formatLabel(t, 'DevAgent OS')}
            </h1>
            <p className='text-xs' style={{ color: t.textSecondary, fontFamily: t.fontFamily }}>
              {formatLabel(t, 'AI-powered development assistant')}
            </p>
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className='w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl transition-all hover:opacity-90 active:scale-95'
            style={{
              background: t.cardBg,
              border: `1px solid ${t.border}`,
              color: t.text,
              fontFamily: t.fontFamily,
            }}
          >
            <svg width='18' height='18' viewBox='0 0 18 18'>
              <path
                fill='#4285F4'
                d='M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z'
              />
              <path
                fill='#34A853'
                d='M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z'
              />
              <path
                fill='#FBBC05'
                d='M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z'
              />
              <path
                fill='#EA4335'
                d='M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z'
              />
            </svg>
            {formatLabel(t, 'Continue with Google')}
          </button>

          <p
            className='text-[10px] text-center'
            style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
          >
            {formatLabel(t, 'By signing in you agree to our terms of service')}
          </p>
        </div>
      </div>
    </div>
  );
}

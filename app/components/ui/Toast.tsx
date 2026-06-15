'use client';

import { useTheme } from '@/app/context/ThemeContext';
import type { ToastData } from '@/app/hooks/useToast';

interface ToastProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

const STYLES = {
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', icon: '⚠️' },
  error:   { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', icon: '🚫' },
  info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', icon: 'ℹ️' },
};

export default function Toast({ toasts, onDismiss }: ToastProps) {
  const { t } = useTheme();

  if (toasts.length === 0) return null;

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col gap-2' style={{ maxWidth: 360 }}>
      {toasts.map((toast) => {
        const s = STYLES[toast.type];
        return (
          <div
            key={toast.id}
            className='rounded-xl px-4 py-3 shadow-lg flex items-start gap-3'
            style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, fontFamily: t.fontFamily }}
          >
            <span className='text-base mt-0.5 shrink-0'>{s.icon}</span>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium' style={{ color: s.text }}>
                {toast.message}
              </p>
              {toast.action && (
                <a
                  href={toast.action.href}
                  className='text-xs font-semibold underline mt-1 inline-block'
                  style={{ color: s.text }}
                >
                  {toast.action.label} →
                </a>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className='text-sm opacity-50 hover:opacity-100 mt-0.5 shrink-0'
              style={{ color: s.text }}
              aria-label='Dismiss'
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

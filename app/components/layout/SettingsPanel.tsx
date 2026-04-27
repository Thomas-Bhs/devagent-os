'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/app/lib/utils';
import { useTheme } from '@/app/context/ThemeContext';

interface TokenStats {
  today: { tokens: number; cost: number };
  week: { tokens: number; cost: number };
  month: { tokens: number; cost: number };
  byAgent: { agent: string; tokens: number; cost: number }[];
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const agentColors: Record<string, string> = {
  dev: '#2563eb',
  debug: '#dc2626',
  qa: '#16a34a',
  orchestrator: '#0284c7',
};

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { t, isFallout, theme } = useTheme();
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  const totalAgentTokens = stats?.byAgent.reduce((acc, a) => acc + a.tokens, 0) || 1;

  return (
    <>
      {isOpen && <div className='fixed inset-0 bg-black/20 z-40' onClick={onClose} />}

      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 z-50 transition-transform duration-300 overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{
          background: t.surface,
          borderLeft: `1px solid ${t.border}`,
        }}
      >
        <div className='p-5'>
          <div className='flex items-center justify-between mb-6'>
            <h2
              className='text-sm font-bold'
              style={{
                color: isFallout ? t.border : t.text,
                fontFamily: isFallout ? 'monospace' : 'inherit',
              }}
            >
              {isFallout ? '// SETTINGS & ANALYTICS_' : 'Settings & Analytics'}
            </h2>
            <button
              onClick={onClose}
              className='w-7 h-7 flex items-center justify-center rounded-lg transition-colors text-lg'
              style={{ color: t.textSecondary }}
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div
                className='w-5 h-5 border-2 rounded-full animate-spin'
                style={{
                  borderColor: `${t.border}30`,
                  borderTopColor: t.border,
                }}
              />
            </div>
          ) : stats ? (
            <>
              <p
                className='text-[10px] font-bold uppercase tracking-widest mb-3'
                style={{
                  color: isFallout ? t.border : '#9ca3af',
                  fontFamily: isFallout ? 'monospace' : 'inherit',
                }}
              >
                {isFallout ? '// TOKEN USAGE_' : 'Token usage'}
              </p>

              <div className='grid grid-cols-3 gap-2 mb-6'>
                {[
                  { label: 'Today', data: stats.today },
                  { label: 'Week', data: stats.week },
                  { label: 'Month', data: stats.month },
                ].map(({ label, data }) => (
                  <div
                    key={label}
                    className='rounded-2xl p-3'
                    style={{
                      background: isFallout ? `${t.border}10` : '#f9fafb',
                      border: `1px solid ${isFallout ? `${t.border}40` : 'transparent'}`,
                    }}
                  >
                    <p
                      className='text-[9px] font-semibold uppercase tracking-wide mb-1'
                      style={{
                        color: t.textSecondary,
                        fontFamily: isFallout ? 'monospace' : 'inherit',
                      }}
                    >
                      {label}
                    </p>
                    <p
                      className='text-sm font-bold'
                      style={{
                        color: isFallout ? t.border : t.text,
                        fontFamily: isFallout ? 'monospace' : 'inherit',
                      }}
                    >
                      {data.tokens.toLocaleString()}
                    </p>
                    <p className='text-[10px] mt-0.5' style={{ color: t.textSecondary }}>
                      ${data.cost.toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>

              <p
                className='text-[10px] font-bold uppercase tracking-widest mb-3'
                style={{
                  color: isFallout ? t.border : '#9ca3af',
                  fontFamily: isFallout ? 'monospace' : 'inherit',
                }}
              >
                {isFallout ? '// BY AGENT_' : 'By agent'}
              </p>

              <div className='space-y-3 mb-6'>
                {stats.byAgent
                  .sort((a, b) => b.tokens - a.tokens)
                  .map((agent) => (
                    <div key={agent.agent}>
                      <div className='flex items-center justify-between mb-1'>
                        <span
                          className='text-xs font-medium capitalize'
                          style={{
                            color: isFallout ? t.border : t.text,
                            fontFamily: isFallout ? 'monospace' : 'inherit',
                          }}
                        >
                          {isFallout ? `> ${agent.agent.toUpperCase()}` : agent.agent}
                        </span>
                        <span
                          className='text-xs'
                          style={{
                            color: t.textSecondary,
                            fontFamily: isFallout ? 'monospace' : 'inherit',
                          }}
                        >
                          {agent.tokens.toLocaleString()} — ${agent.cost.toFixed(4)}
                        </span>
                      </div>
                      <div
                        className='h-1.5 rounded-full overflow-hidden'
                        style={{ background: isFallout ? `${t.border}20` : '#f3f4f6' }}
                      >
                        <div
                          className='h-full rounded-full transition-all duration-500'
                          style={{
                            width: `${(agent.tokens / totalAgentTokens) * 100}%`,
                            background: isFallout
                              ? t.border
                              : agentColors[agent.agent] || '#6b7280',
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <p
                className='text-[10px] font-bold uppercase tracking-widest mb-3'
                style={{
                  color: isFallout ? t.border : '#9ca3af',
                  fontFamily: isFallout ? 'monospace' : 'inherit',
                }}
              >
                {isFallout ? '// MODELS_' : 'Models'}
              </p>

              <div
                className='rounded-2xl p-3 space-y-1.5 text-xs'
                style={{
                  background: isFallout ? `${t.border}10` : '#f9fafb',
                  border: `1px solid ${isFallout ? `${t.border}40` : 'transparent'}`,
                }}
              >
                {[
                  { agent: 'Dev', model: 'Claude Sonnet' },
                  { agent: 'Debug', model: 'Claude Sonnet' },
                  { agent: 'QA', model: 'Claude Haiku' },
                  { agent: 'Orchestrator', model: 'Claude Sonnet' },
                ].map(({ agent, model }) => (
                  <div key={agent} className='flex justify-between'>
                    <span
                      style={{
                        color: t.textSecondary,
                        fontFamily: isFallout ? 'monospace' : 'inherit',
                      }}
                    >
                      {isFallout ? `> ${agent}` : agent}
                    </span>
                    <span
                      className='font-medium'
                      style={{
                        color: isFallout ? t.border : t.text,
                        fontFamily: isFallout ? 'monospace' : 'inherit',
                      }}
                    >
                      {model}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p
              className='text-xs text-center py-8'
              style={{
                color: t.textSecondary,
                fontFamily: isFallout ? 'monospace' : 'inherit',
              }}
            >
              {isFallout ? '> No data found_' : 'No data available yet'}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

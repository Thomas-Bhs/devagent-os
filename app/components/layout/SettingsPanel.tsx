'use client';

import { cn } from '@/app/lib/utils';
import { useTheme } from '@/app/context/ThemeContext';
import { useTokenStats } from '@/app/hooks/useTokenStats';
import { formatLabel } from '@/app/lib/theme';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const agentColors: Record<string, string> = {
  dev: '#2563eb',
  debug: '#dc2626',
  qa: '#16a34a',
  uiux: '#a21caf',
  designer: '#ea580c',
  orchestrator: '#0284c7',
};

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { t } = useTheme();
  const { stats, loading, totalAgentTokens } = useTokenStats(isOpen);

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
                color: t.highlightColor,
                fontFamily: t.fontFamily,
              }}
            >
              {formatLabel(t, 'Settings & Analytics')}
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
                  color: t.sectionLabelColor,
                  fontFamily: t.fontFamily,
                }}
              >
                {formatLabel(t, 'Token usage')}
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
                      background: t.cardBg,
                      border: `1px solid ${t.cardBorder}`,
                    }}
                  >
                    <p
                      className='text-[9px] font-semibold uppercase tracking-wide mb-1'
                      style={{
                        color: t.textSecondary,
                        fontFamily: t.fontFamily,
                      }}
                    >
                      {label}
                    </p>
                    <p
                      className='text-sm font-bold'
                      style={{
                        color: t.highlightColor,
                        fontFamily: t.fontFamily,
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
                  color: t.sectionLabelColor,
                  fontFamily: t.fontFamily,
                }}
              >
                {formatLabel(t, 'By agent')}
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
                            color: t.highlightColor,
                            fontFamily: t.fontFamily,
                          }}
                        >
                          {formatLabel(t, agent.agent)}
                        </span>
                        <span
                          className='text-xs'
                          style={{
                            color: t.textSecondary,
                            fontFamily: t.fontFamily,
                          }}
                        >
                          {agent.tokens.toLocaleString()} — ${agent.cost.toFixed(4)}
                        </span>
                      </div>
                      <div
                        className='h-1.5 rounded-full overflow-hidden'
                        style={{ background: t.subtleBg }}
                      >
                        <div
                          className='h-full rounded-full transition-all duration-500'
                          style={{
                            width: `${(agent.tokens / totalAgentTokens) * 100}%`,
                            background: t.agentBarBg || agentColors[agent.agent] || '#6b7280',
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <p
                className='text-[10px] font-bold uppercase tracking-widest mb-3'
                style={{
                  color: t.sectionLabelColor,
                  fontFamily: t.fontFamily,
                }}
              >
                {formatLabel(t, 'Models')}
              </p>

              <div
                className='rounded-2xl p-3 space-y-1.5 text-xs'
                style={{
                  background: t.cardBg,
                  border: `1px solid ${t.cardBorder}`,
                }}
              >
                {[
                  { agent: 'Dev', model: 'Claude Sonnet' },
                  { agent: 'Debug', model: 'Claude Sonnet' },
                  { agent: 'QA', model: 'Claude Haiku' },
                  { agent: 'UI/UX', model: 'Claude Haiku' },
                  { agent: 'Designer', model: 'Claude Haiku' },
                  { agent: 'Orchestrator', model: 'Claude Sonnet' },
                ].map(({ agent, model }) => (
                  <div key={agent} className='flex justify-between'>
                    <span
                      style={{
                        color: t.textSecondary,
                        fontFamily: t.fontFamily,
                      }}
                    >
                      {formatLabel(t, agent)}
                    </span>
                    <span
                      className='font-medium'
                      style={{
                        color: t.highlightColor,
                        fontFamily: t.fontFamily,
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
                fontFamily: t.fontFamily,
              }}
            >
              {formatLabel(t, 'No data available yet')}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import { Gauge } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';
import AgentChip from '../agents/AgentChip';

interface ActiveAgent {
  name: string;
  color: 'indigo' | 'amber' | 'green' | 'purple' | 'sky';
}

interface TopbarProps {
  activeAgents: ActiveAgent[];
  onThemeToggle: () => void;
  onClear: () => void;
  onSettings: () => void;
}

export default function Topbar({ activeAgents, onThemeToggle, onClear, onSettings }: TopbarProps) {
  const { t } = useTheme();
  const isFallout = !!t.labelPrefix;

  return (
    <div
      className='h-14 px-6 flex items-center justify-between flex-shrink-0'
      style={{
        background: t.surface,
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2.5'>
          <div
            className='w-8 h-8 rounded-xl flex items-center justify-center'
            style={{ background: t.accent }}
          >
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <rect x='2' y='2' width='5' height='5' rx='1.5' fill={t.bg} />
              <rect x='9' y='2' width='5' height='5' rx='1.5' fill={t.bg} fillOpacity='0.5' />
              <rect x='2' y='9' width='5' height='5' rx='1.5' fill={t.bg} fillOpacity='0.5' />
              <rect x='9' y='9' width='5' height='5' rx='1.5' fill={t.bg} fillOpacity='0.3' />
            </svg>
          </div>
          <span
            className='text-sm font-bold tracking-tight'
            style={{ color: t.text, fontFamily: t.fontFamily }}
          >
            DevAgent
            <span style={{ color: t.textSecondary, fontWeight: 400 }}>OS</span>
          </span>
        </div>

        <div className='w-px h-4' style={{ background: t.border }} />

        <div className='flex items-center gap-1.5'>
          {activeAgents.length === 0 ? (
            <span className='text-xs' style={{ color: t.textSecondary, fontFamily: t.fontFamily }}>
              No agent selected
            </span>
          ) : (
            activeAgents.map((agent) =>
              isFallout ? (
                <div
                  key={agent.name}
                  className='flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded fallout-selected'
                  style={{
                    background: `${t.border}15`,
                    border: `1px solid ${t.border}`,
                    color: t.border,
                    fontFamily: t.fontFamily,
                  }}
                >
                  <div
                    className='w-1.5 h-1.5 rounded-full animate-pulse'
                    style={{ background: t.border }}
                  />
                  {`> ${agent.name.toUpperCase()}_`}
                </div>
              ) : (
                <AgentChip key={agent.name} name={agent.name} color={agent.color} />
              )
            )
          )}
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <button
          onClick={onSettings}
          className='w-8 h-8 flex items-center justify-center rounded-xl transition-colors'
          style={{ color: t.textSecondary }}
        >
          <Gauge size={15} />
        </button>

        <button
          onClick={onThemeToggle}
          className='w-9 h-5 rounded-full relative transition-colors duration-200'
          style={{ background: isFallout ? t.border : '#e5e7eb' }}
        >
          <div
            className='w-4 h-4 rounded-full absolute top-0.5 transition-transform duration-200 shadow-sm'
            style={{
              background: isFallout ? t.bg : 'white',
              transform: isFallout ? 'translateX(16px)' : 'translateX(2px)',
            }}
          />
        </button>

        <button
          onClick={onClear}
          className='text-xs px-3 py-1.5 rounded-lg transition-colors'
          style={{
            color: t.textSecondary,
            border: `1px solid ${t.border}`,
            fontFamily: t.fontFamily,
          }}
        >
          {formatLabel(t, 'Clear')}
        </button>
      </div>
    </div>
  );
}

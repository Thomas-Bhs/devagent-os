'use client';

import { Gauge } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';
import AgentChip from '../agents/AgentChip';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import type { Theme } from '@/app/lib/theme';

interface ActiveAgent {
  name: string;
  hexColor: string;
}

interface TopbarProps {
  activeAgents: ActiveAgent[];
  onClear: () => void;
  onSettings: () => void;
  onMenuToggle: () => void;
}

export default function Topbar({ activeAgents, onClear, onSettings, onMenuToggle }: TopbarProps) {
  const { t, theme, setTheme } = useTheme();
  const isFallout = !!t.labelPrefix;
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: Theme; label: string }[] = [
    { id: 'spatial', label: 'Spatial' },
    { id: 'fallout', label: 'Fallout' },
  ];

  return (
    <div
      className='h-14 px-6 flex items-center justify-between flex-shrink-0'
      style={{
        background: t.surface,
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      {/* LEFT — Logo + agents actifs */}
      <div className='flex items-center gap-4'>
        {/* Burger — mobile only */}
        <button
          onClick={onMenuToggle}
          aria-label='Toggle menu'
          className='md:hidden w-8 h-8 flex items-center justify-center rounded-xl transition-colors'
          style={{ color: t.text }}
        >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
            <path
              d='M2 4h14M2 9h14M2 14h14'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
            />
          </svg>
        </button>

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
                <AgentChip key={agent.name} name={agent.name} hexColor={agent.hexColor} />
              )
            )
          )}
        </div>
      </div>

      {/* RIGHT — Gauge + Clear + Avatar menu */}
      <div className='flex items-center gap-3'>
        {/* Settings gauge */}
        <button
          onClick={onSettings}
          aria-label='Open settings'
          className='w-8 h-8 flex items-center justify-center rounded-xl transition-colors'
          style={{ color: t.textSecondary }}
        >
          <Gauge size={15} />
        </button>

        {/* Clear */}
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

        {/* Avatar + dropdown menu */}
        {session?.user && (
          <div className='relative' ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label='Open user menu'
              className='flex items-center justify-center rounded-full overflow-hidden transition-opacity hover:opacity-80'
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={28}
                  height={28}
                  className='rounded-full'
                />
              ) : (
                <div
                  className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold'
                  style={{ backgroundColor: t.accent, color: t.bg }}
                >
                  {session.user.name?.[0] ?? '?'}
                </div>
              )}
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                className='absolute right-0 top-10 w-56 rounded-xl shadow-lg z-50 overflow-hidden'
                style={{
                  backgroundColor: t.surface,
                  border: `1px solid ${t.border}`,
                }}
              >
                {/* Email */}
                <div className='px-4 py-3 border-b' style={{ borderColor: t.border }}>
                  <p
                    className='text-xs truncate'
                    style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
                  >
                    {session.user.email}
                  </p>
                </div>

                {/* Pricing */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/pricing');
                  }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:opacity-80'
                  style={{ color: t.text, fontFamily: t.fontFamily }}
                >
                  <span>💳</span>
                  <span>{isFallout ? 'PRICING_' : 'Pricing'}</span>
                </button>

                {/* Billing */}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('/billing');
                  }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:opacity-80'
                  style={{ color: t.text, fontFamily: t.fontFamily }}
                >
                  <span>📊</span>
                  <span>{isFallout ? 'BILLING_' : 'Billing'}</span>
                </button>

                {/* Manage subscription */}
                <button
                  onClick={async () => {
                    setMenuOpen(false);
                    const res = await fetch('/api/stripe/portal', { method: 'POST' });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:opacity-80'
                  style={{ color: t.text, fontFamily: t.fontFamily }}
                >
                  <span>🔧</span>
                  <span>{isFallout ? 'MANAGE_SUBSCRIPTION_' : 'Manage subscription'}</span>
                </button>

                <div className='h-px mx-4' style={{ backgroundColor: t.border }} />

                {/* Settings — Theme + Delete account */}
                <div>
                  <button
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    className='w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:opacity-80'
                    style={{ color: t.text, fontFamily: t.fontFamily }}
                  >
                    <div className='flex items-center gap-3'>
                      <span>⚙️</span>
                      <span>{isFallout ? 'SETTINGS_' : 'Settings'}</span>
                    </div>
                    <span style={{ color: t.textSecondary }}>{settingsOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Submenu */}
                  {settingsOpen && (
                    <div className='px-4 pb-2' style={{ backgroundColor: t.subtleBg }}>
                      {/* Theme */}
                      <p
                        className='text-[10px] uppercase font-semibold pt-2 pb-1.5'
                        style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
                      >
                        {isFallout ? 'THEME_' : 'Theme'}
                      </p>
                      {themes.map((th) => (
                        <button
                          key={th.id}
                          onClick={() => {
                            setTheme(th.id);
                            setMenuOpen(false);
                            setSettingsOpen(false);
                          }}
                          className='w-full flex items-center gap-2 py-1.5 text-sm transition-colors'
                          style={{
                            color: theme === th.id ? t.accent : t.textSecondary,
                            fontFamily: t.fontFamily,
                          }}
                        >
                          <span style={{ color: t.accent }}>{theme === th.id ? '●' : '○'}</span>
                          {th.label}
                        </button>
                      ))}

                      {/* Séparateur */}
                      <div className='h-px my-2' style={{ backgroundColor: t.border }} />

                      {/* Delete account */}
                      <button
                        onClick={async () => {
                          setMenuOpen(false);
                          setSettingsOpen(false);
                          if (!confirm('Are you sure? This action cannot be undone.')) return;
                          const res = await fetch('/api/user/delete', { method: 'DELETE' });
                          if (res.ok) {
                            const { signOut } = await import('next-auth/react');
                            await signOut({ callbackUrl: '/auth/signin' });
                          }
                        }}
                        className='w-full flex items-center gap-2 py-1.5 text-sm transition-colors'
                        style={{ color: '#dc2626', fontFamily: t.fontFamily }}
                      >
                        <span>🗑️</span>
                        <span>{isFallout ? 'DELETE_ACCOUNT_' : 'Delete account'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className='h-px mx-4' style={{ backgroundColor: t.border }} />

                {/* Sign out */}
                <button
                  onClick={() => signOut()}
                  className='w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:opacity-80'
                  style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
                >
                  <span>↩</span>
                  <span>{isFallout ? 'SIGN_OUT_' : 'Sign out'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

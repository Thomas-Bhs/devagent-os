'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { AGENTS } from '@/app/config/agents';
import { FREE_AGENTS } from '@/app/lib/plans';

const STORAGE_KEY = 'devagent_onboarded';

export default function OnboardingModal() {
  const { t } = useTheme();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const isFallout = !!t.labelPrefix;

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className='w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl'
        style={{ backgroundColor: t.surface, border: `1px solid ${t.border}` }}
      >
        {/* Step indicator */}
        <div className='flex gap-1.5 px-6 pt-5'>
          {[0, 1].map((i) => (
            <div
              key={i}
              className='h-1 flex-1 rounded-full transition-all duration-300'
              style={{ backgroundColor: i <= step ? t.accent : t.border }}
            />
          ))}
        </div>

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className='px-6 py-8'>
            <div
              className='w-14 h-14 rounded-2xl flex items-center justify-center mb-5'
              style={{ backgroundColor: t.accent }}
            >
              <svg width='28' height='28' viewBox='0 0 28 28' fill='none'>
                <rect x='3' y='3' width='9' height='9' rx='2.5' fill={t.bg} />
                <rect x='16' y='3' width='9' height='9' rx='2.5' fill={t.bg} fillOpacity='0.5' />
                <rect x='3' y='16' width='9' height='9' rx='2.5' fill={t.bg} fillOpacity='0.5' />
                <rect x='16' y='16' width='9' height='9' rx='2.5' fill={t.bg} fillOpacity='0.3' />
              </svg>
            </div>

            <h2 className='text-2xl font-bold mb-3' style={{ color: t.text, fontFamily: t.fontFamily }}>
              {isFallout ? '>> WELCOME TO DEVAGENT OS_' : 'Welcome to DevAgent OS'}
            </h2>
            <p className='text-sm leading-relaxed mb-6' style={{ color: t.textSecondary, fontFamily: t.fontFamily }}>
              {isFallout
                ? 'A MULTI-AGENT AI SYSTEM WHERE EACH AGENT SPECIALIZES IN A DEVELOPMENT TASK. SELECT AN AGENT AND START BUILDING.'
                : 'A multi-agent AI system where each agent specializes in a specific development task. Select an agent and start building — no setup required.'}
            </p>

            <div
              className='rounded-xl p-4 mb-6'
              style={{ backgroundColor: t.subtleBg, border: `1px solid ${t.cardBorder}` }}
            >
              <p className='text-xs font-semibold uppercase mb-2' style={{ color: t.sectionLabelColor, fontFamily: t.fontFamily }}>
                {isFallout ? '>> FREE TRIAL' : 'Free trial'}
              </p>
              <p className='text-sm' style={{ color: t.textSecondary, fontFamily: t.fontFamily }}>
                {isFallout
                  ? '20 FREE REQUESTS ON DEV, DEBUG & QA AGENTS — NO CREDIT CARD REQUIRED.'
                  : '20 free requests on Dev, Debug & QA agents — no credit card required.'}
              </p>
            </div>

            <button
              onClick={() => setStep(1)}
              className='w-full py-3 rounded-xl font-semibold text-sm'
              style={{ backgroundColor: t.accent, color: t.bg, fontFamily: t.fontFamily }}
            >
              {isFallout ? 'NEXT: VIEW AGENTS_' : 'Next — view agents →'}
            </button>
          </div>
        )}

        {/* Step 1 — Agents */}
        {step === 1 && (
          <div className='px-6 py-8'>
            <h2 className='text-xl font-bold mb-1' style={{ color: t.text, fontFamily: t.fontFamily }}>
              {isFallout ? '>> YOUR AGENTS_' : 'Your agents'}
            </h2>
            <p className='text-sm mb-5' style={{ color: t.textSecondary, fontFamily: t.fontFamily }}>
              {isFallout
                ? 'EACH AGENT IS SPECIALIZED. CHOOSE THE RIGHT ONE FOR YOUR TASK.'
                : 'Each agent is specialized. Pick the right one for your task.'}
            </p>

            <div className='flex flex-col gap-2 mb-6'>
              {AGENTS.map((agent) => {
                const isFree = FREE_AGENTS.includes(agent.id);
                return (
                  <div
                    key={agent.id}
                    className='flex items-center gap-3 px-4 py-3 rounded-xl'
                    style={{
                      backgroundColor: t.cardBg,
                      border: `1px solid ${t.cardBorder}`,
                    }}
                  >
                    <div
                      className='w-8 h-8 rounded-lg flex items-center justify-center shrink-0'
                      style={{ backgroundColor: agent.iconBg }}
                    >
                      {agent.icon}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold' style={{ color: t.text, fontFamily: t.fontFamily }}>
                        {isFallout ? agent.name.toUpperCase() : agent.name}
                      </p>
                      <p className='text-xs' style={{ color: t.textSecondary, fontFamily: t.fontFamily }}>
                        {agent.description}
                      </p>
                    </div>
                    <span
                      className='text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0'
                      style={
                        isFree
                          ? { backgroundColor: '#dcfce7', color: '#15803d' }
                          : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                      }
                    >
                      {isFree ? 'Free' : 'Paid'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className='flex gap-3'>
              <button
                onClick={() => router.push('/pricing')}
                className='flex-1 py-3 rounded-xl font-semibold text-sm'
                style={{
                  backgroundColor: t.subtleBg,
                  color: t.text,
                  border: `1px solid ${t.cardBorder}`,
                  fontFamily: t.fontFamily,
                }}
                onMouseDown={dismiss}
              >
                {isFallout ? 'VIEW PLANS_' : 'View plans'}
              </button>
              <button
                onClick={dismiss}
                className='flex-1 py-3 rounded-xl font-semibold text-sm'
                style={{ backgroundColor: t.accent, color: t.bg, fontFamily: t.fontFamily }}
              >
                {isFallout ? "LET'S GO_" : "Let's go →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';
import AgentCard from '../agents/AgentCard';
import type { AgentConfig } from '@/app/config/agents';
import { PLANS, getMinPlanForAgent } from '@/app/lib/plans';

interface Conversation {
  id: string;
  title: string;
  agentName: string;
  agentColor: string;
  date: string;
}

interface SidebarProps {
  agents: AgentConfig[];
  selectedAgentId: string;
  conversations: Conversation[];
  activeConversationId: string;
  isOpen: boolean;
  onClose: () => void;
  onAgentSelect: (id: string) => void;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onDeleteAllConversations: () => void;
  allowedAgentIds: string[] | null;
}

interface LockedAgentPopup {
  agentId: string;
  agentName: string;
  minPlanId: string;
}

export default function Sidebar({
  agents,
  selectedAgentId,
  conversations,
  activeConversationId,
  isOpen,
  onClose,
  onAgentSelect,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  onDeleteAllConversations,
  allowedAgentIds,
}: SidebarProps) {
  const { t } = useTheme();
  const isFallout = !!t.labelPrefix;
  const router = useRouter();
  const [lockedPopup, setLockedPopup] = useState<LockedAgentPopup | null>(null);

  const isAgentLocked = (agentId: string) =>
    allowedAgentIds !== null && !allowedAgentIds.includes(agentId);

  const handleAgentClick = (agent: AgentConfig) => {
    if (isAgentLocked(agent.id)) {
      setLockedPopup({
        agentId: agent.id,
        agentName: agent.name,
        minPlanId: getMinPlanForAgent(agent.id),
      });
      return;
    }
    onAgentSelect(agent.id);
    onClose();
  };

  const sidebarContent = (
    <div
      className='w-64 h-full flex flex-col overflow-hidden shrink-0'
      style={{
        background: t.surface,
        borderRight: `1px solid ${t.border}`,
      }}
    >
      <div className='px-4 pt-4 pb-2'>
        <p
          className='text-[10px] font-bold uppercase tracking-widest mb-3'
          style={{ color: t.sectionLabelColor, fontFamily: t.fontFamily }}
        >
          {formatLabel(t, 'Agents')}
        </p>
        <div className='grid grid-cols-2 gap-2'>
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              name={agent.name}
              description={agent.description}
              icon={agent.icon}
              iconBg={agent.iconBg}
              badge={agent.badge}
              isSelected={selectedAgentId === agent.id}
              isDisabled={isAgentLocked(agent.id)}
              onClick={() => handleAgentClick(agent)}
              agentId={agent.id}
            />
          ))}
        </div>
      </div>

      <div className='mx-4 my-3 h-px' style={{ background: t.border }} />

      <div className='px-4 flex items-center justify-between mb-2'>
        <p
          className='text-[10px] font-bold uppercase tracking-widest'
          style={{ color: t.sectionLabelColor, fontFamily: t.fontFamily }}
        >
          {formatLabel(t, 'History')}
        </p>
        <button
          onClick={onNewConversation}
          aria-label='New conversation'
          className='text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors'
          style={{ background: t.accent, color: t.bg, fontFamily: t.fontFamily }}
        >
          + New
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-2'>
        {conversations.length === 0 ? (
          <p
            className='text-xs px-2 py-3'
            style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
          >
            {isFallout ? '> No logs found_' : 'No conversations yet'}
          </p>
        ) : (
          <>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  onConversationSelect(conv.id);
                  onClose();
                }}
                className='px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 mb-1 transition-colors group'
                style={{
                  background: activeConversationId === conv.id ? t.userBubbleBg : 'transparent',
                  border: `1px solid ${
                    activeConversationId === conv.id ? t.border : 'transparent'
                  }`,
                }}
              >
                <div
                  className='w-1.5 h-1.5 rounded-full shrink-0'
                  style={{ background: isFallout ? t.border : conv.agentColor }}
                />
                <div className='flex-1 overflow-hidden'>
                  <p
                    className='text-xs truncate font-medium'
                    style={{
                      color: activeConversationId === conv.id ? t.userBubbleText : t.text,
                      fontFamily: t.fontFamily,
                    }}
                  >
                    {conv.title}
                  </p>
                  <p className='text-[10px] mt-0.5' style={{ color: t.textSecondary }}>
                    {conv.agentName} · {conv.date}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  aria-label='Delete conversation'
                  className='opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg'
                >
                  <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                    <path
                      d='M2 3h8M5 3V2h2v1M4 3v6h4V3'
                      stroke={isFallout ? t.border : '#ef4444'}
                      strokeWidth='1'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={onDeleteAllConversations}
              className='w-full mt-2 text-[10px] py-1.5 rounded-lg transition-colors'
              style={{ color: isFallout ? t.border : '#ef4444', fontFamily: t.fontFamily }}
            >
              {isFallout ? '> Clear all logs_' : 'Clear all conversations'}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop — sidebar visible */}
      <div className='hidden md:flex'>{sidebarContent}</div>

      {/* Mobile — drawer overlay */}
      {isOpen && (
        <div className='md:hidden fixed inset-0 z-50 flex'>
          <div className='absolute inset-0 bg-black/50' onClick={onClose} />
          <div className='relative z-10 h-full'>{sidebarContent}</div>
        </div>
      )}

      {/* Upgrade popup — agent locked */}
      {lockedPopup && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center p-4'
          onClick={() => setLockedPopup(null)}
        >
          <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' />
          <div
            className='relative w-full max-w-sm rounded-2xl p-6 shadow-xl'
            style={{ backgroundColor: t.surface, border: `1px solid ${t.cardBorder}` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lock icon */}
            <div
              className='w-12 h-12 rounded-2xl flex items-center justify-center mb-4'
              style={{ backgroundColor: t.subtleBg }}
            >
              <svg width='22' height='22' viewBox='0 0 22 22' fill='none'>
                <rect
                  x='3'
                  y='10'
                  width='16'
                  height='11'
                  rx='2.5'
                  stroke={t.textSecondary}
                  strokeWidth='1.5'
                />
                <path
                  d='M7 10V7a4 4 0 018 0v3'
                  stroke={t.textSecondary}
                  strokeWidth='1.5'
                  strokeLinecap='round'
                />
              </svg>
            </div>

            <p className='text-base font-bold mb-1' style={{ color: t.text }}>
              {isFallout
                ? `>> ${lockedPopup.agentName.toUpperCase()} LOCKED_`
                : `${lockedPopup.agentName} — Plan required`}
            </p>
            <p className='text-sm mb-4' style={{ color: t.textSecondary }}>
              {isFallout
                ? `REQUIRES ${PLANS[lockedPopup.minPlanId]?.name.toUpperCase()} PLAN OR HIGHER_`
                : `This agent requires the ${PLANS[lockedPopup.minPlanId]?.name} plan or higher. Upgrade to unlock it.`}
            </p>

            <div className='flex gap-2'>
              <button
                onClick={() => {
                  setLockedPopup(null);
                  router.push('/pricing');
                }}
                className='flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90'
                style={{ backgroundColor: t.accent, color: t.bg }}
              >
                {isFallout ? 'VIEW PLANS_' : 'View plans →'}
              </button>
              <button
                onClick={() => setLockedPopup(null)}
                className='px-4 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-70'
                style={{
                  backgroundColor: t.subtleBg,
                  color: t.textSecondary,
                  border: `1px solid ${t.cardBorder}`,
                }}
              >
                {isFallout ? 'CLOSE_' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useEffect, useRef } from 'react';
import { Message } from '@ai-sdk/react';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';
import { getAgentById } from '@/app/config/agents';
import MessageBubble from './MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  agentId: string;
}

function exportToMarkdown(messages: Message[], agentId: string) {
  const agent = getAgentById(agentId);
  const agentName = agent?.name ?? agentId;
  const date = new Date().toISOString().slice(0, 10);

  const lines = [
    `# DevAgent OS — ${agentName} — ${date}`,
    '',
    ...messages.map((m) => {
      const role = m.role === 'user' ? '**You**' : `**${agentName}**`;
      const content = typeof m.content === 'string' ? m.content : '';
      return `${role}\n\n${content}\n\n---`;
    }),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `devagent-${agentId}-${date}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ChatMessages({ messages, isLoading, agentId }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { t } = useTheme();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-4 text-center px-8'>
        <div
          className='w-16 h-16 rounded-3xl flex items-center justify-center'
          style={{
            background: t.userBubbleBg,
            border: `1px solid ${t.border}`,
          }}
        >
          <svg width='28' height='28' viewBox='0 0 28 28' fill='none'>
            <rect x='3' y='3' width='9' height='9' rx='2.5' fill={t.userBubbleText} />
            <rect
              x='16'
              y='3'
              width='9'
              height='9'
              rx='2.5'
              fill={t.userBubbleText}
              fillOpacity='0.5'
            />
            <rect
              x='3'
              y='16'
              width='9'
              height='9'
              rx='2.5'
              fill={t.userBubbleText}
              fillOpacity='0.5'
            />
            <rect
              x='16'
              y='16'
              width='9'
              height='9'
              rx='2.5'
              fill={t.userBubbleText}
              fillOpacity='0.3'
            />
          </svg>
        </div>
        <div>
          <p className='text-sm font-bold mb-1' style={{ color: t.text, fontFamily: t.fontFamily }}>
            {formatLabel(t, 'Ready to code')}
          </p>
          <p
            className='text-xs max-w-xs leading-relaxed'
            style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
          >
            {t.labelPrefix
              ? formatLabel(t, 'Select an agent and initialize the sequence')
              : 'Select an agent and ask your first question, or upload a file to analyze.'}
          </p>
        </div>
        {!t.labelPrefix && (
          <div className='flex gap-2 flex-wrap justify-center'>
            {['Create a React hook', 'Debug my code', 'Generate tests'].map((suggestion) => (
              <button
                key={suggestion}
                className='text-xs border px-3 py-1.5 rounded-full transition-colors'
                style={{ color: t.textSecondary, borderColor: t.border }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-5'>
      <div className='flex justify-end'>
        <button
          onClick={() => exportToMarkdown(messages, agentId)}
          className='text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70 flex items-center gap-1.5'
          style={{ color: t.textSecondary, border: `1px solid ${t.border}`, fontFamily: t.fontFamily }}
          title='Export as Markdown'
        >
          <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <path d='M6 1v7M3 5l3 3 3-3M1 10h10' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
          {t.labelPrefix ? 'EXPORT_' : 'Export'}
        </button>
      </div>
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          role={m.role === 'user' ? 'user' : 'assistant'}
          content={typeof m.content === 'string' ? m.content : ''}
          agentName='Agent Dev'
          toolInvocations={m.toolInvocations?.map((tool) => ({
            toolCallId: tool.toolCallId,
            toolName: tool.toolName,
            state: tool.state as 'partial-call' | 'call' | 'result',
          }))}
          isDesigner={agentId === 'designer'}
        />
      ))}

      {isLoading && (
        <div className='flex gap-3 items-center'>
          <div
            className='w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0'
            style={{
              background: t.userBubbleBg,
              color: t.userBubbleText,
              fontFamily: t.fontFamily,
            }}
          >
            {t.labelPrefix ? '>' : 'D'}
          </div>
          <div
            className='rounded-2xl px-4 py-3 flex gap-1.5'
            style={{
              background: t.agentBubbleBg,
              border: `1px solid ${t.agentBubbleBorder}`,
            }}
          >
            <div
              className='w-1.5 h-1.5 rounded-full animate-bounce'
              style={{ background: t.border, animationDelay: '0ms' }}
            />
            <div
              className='w-1.5 h-1.5 rounded-full animate-bounce'
              style={{ background: t.border, animationDelay: '150ms' }}
            />
            <div
              className='w-1.5 h-1.5 rounded-full animate-bounce'
              style={{ background: t.border, animationDelay: '300ms' }}
            />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

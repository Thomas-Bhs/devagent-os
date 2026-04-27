import ReactMarkdown from 'react-markdown';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';
import ToolPill from './ToolPill';

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: 'partial-call' | 'call' | 'result';
}

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  agentName?: string;
  toolInvocations?: ToolInvocation[];
}

export default function MessageBubble({
  role,
  content,
  agentName = 'Agent',
  toolInvocations,
}: MessageBubbleProps) {
  const { t } = useTheme();

  if (role === 'user') {
    return (
      <div className='flex justify-end'>
        <div
          className='max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed'
          style={{
            background: t.userBubbleBg,
            color: t.userBubbleText,
            border: `1px solid ${t.userBubbleBg}`,
            fontFamily: t.fontFamily,
          }}
        >
          {`${t.labelPrefix}${content}${t.labelSuffix && t.labelSuffix}`}
        </div>
      </div>
    );
  }

  return (
    <div className='flex gap-3 items-start'>
      <div
        className='w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5'
        style={{
          background: t.userBubbleBg,
          color: t.userBubbleText,
          fontFamily: t.fontFamily,
        }}
      >
        {t.labelPrefix ? '>' : agentName.slice(0, 1)}
      </div>

      <div className='flex-1 min-w-0'>
        <p
          className='text-[10px] font-bold uppercase tracking-widest mb-1.5'
          style={{
            color: t.sectionLabelColor,
            fontFamily: t.fontFamily,
          }}
        >
          {formatLabel(t, agentName)}
        </p>

        {toolInvocations?.map((tool) => (
          <ToolPill
            key={tool.toolCallId}
            toolName={tool.toolName}
            state={tool.state === 'partial-call' || tool.state === 'call' ? 'running' : 'completed'}
          />
        ))}

        {content && (
          <div
            className='rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed'
            style={{
              background: t.agentBubbleBg,
              border: `1px solid ${t.agentBubbleBorder}`,
              color: t.text,
              fontFamily: t.fontFamily,
            }}
          >
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const isBlock = className?.includes('language-');
                  return isBlock ? (
                    <pre
                      className='p-4 rounded-xl overflow-x-auto my-3 text-xs leading-relaxed'
                      style={{
                        background: t.codeBg,
                        color: t.codeText,
                        border: `1px solid ${t.border}`,
                      }}
                    >
                      <code>{children}</code>
                    </pre>
                  ) : (
                    <code
                      className='px-1.5 py-0.5 rounded-lg text-xs font-mono'
                      style={{
                        background: t.cardBg,
                        color: t.text,
                      }}
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className='mb-2 last:mb-0'>{children}</p>;
                },
                ul({ children }) {
                  return <ul className='list-disc pl-4 mb-2 space-y-1'>{children}</ul>;
                },
                ol({ children }) {
                  return <ol className='list-decimal pl-4 mb-2 space-y-1'>{children}</ol>;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

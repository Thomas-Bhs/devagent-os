'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';
import { Eye } from 'lucide-react';
import ToolPill from './ToolPill';
import PreviewModal from './PreviewModal';

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
  isDesigner?: boolean;
}

function extractJSXCode(content: string): string | null {
  const bt = String.fromCharCode(96, 96, 96)
  const pattern = bt + '(?:jsx|tsx|javascript|typescript)?\\n([\\s\\S]*?)' + bt
  const regex = new RegExp(pattern, 'g')
  const matches = [...content.matchAll(regex)]
  
  console.log('nombre de blocs trouvés:', matches.length)
  
  for (const match of matches) {
    const code = match[1].trim()
    if (
      (code.includes('export default') || code.includes('function ') || code.includes('const ')) &&
      (code.includes('return (') || code.includes('return(')) &&
      (code.includes('<div') || code.includes('<section') || code.includes('<main') || code.includes('<nav'))
    ) {
      return code
    }
  }
  return null
}

export default function MessageBubble({
  role,
  content,
  agentName = 'Agent',
  toolInvocations,
  isDesigner = false,
}: MessageBubbleProps) {
  const { t } = useTheme();
  const [previewCode, setPreviewCode] = useState<string | null>(null);

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

  const jsxCode = isDesigner ? extractJSXCode(content) : null;

  return (
    <>
      {previewCode && <PreviewModal code={previewCode} onClose={() => setPreviewCode(null)} />}

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
              state={
                tool.state === 'partial-call' || tool.state === 'call' ? 'running' : 'completed'
              }
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

              {jsxCode && (
                <button
                  onClick={() => setPreviewCode(jsxCode)}
                  className='mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-xl transition-all'
                  style={{
                    background: t.cardBg,
                    color: t.text,
                    border: `1px solid ${t.border}`,
                  }}
                >
                  <Eye size={13} />
                  {t.labelPrefix ? '> Preview component_' : 'Preview component'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

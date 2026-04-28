'use client';

import { useState } from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';

interface PreviewModalProps {
  code: string;
  onClose: () => void;
}

function isReactNative(code: string): boolean {
  return (
    code.includes('react-native') ||
    code.includes('StyleSheet') ||
    code.includes('View>') ||
    code.includes('Text>') ||
    code.includes('TouchableOpacity')
  );
}

export default function PreviewModal({ code, onClose }: PreviewModalProps) {
  const { t } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isNative = isReactNative(code);

  return (
    <>
      <style>{`
        .sp-preview-container,
        .sp-preview-iframe,
        .sp-stack,
        .sp-wrapper {
          height: 100% !important;
          min-height: 0 !important;
        }
      `}</style>

      <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50'>
        <div
          className='w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl'
          style={{ background: t.surface, border: '1px solid ' + t.border }}
        >
          <div
            className='flex items-center justify-between px-5 py-3 flex-shrink-0'
            style={{ borderBottom: '1px solid ' + t.border }}
          >
            <p
              className='text-sm font-semibold'
              style={{ color: t.text, fontFamily: t.fontFamily }}
            >
              {t.labelPrefix ? '// PREVIEW_' : 'Preview'}
            </p>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleCopy}
                className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors'
                style={{
                  background: t.cardBg,
                  color: t.textSecondary,
                  border: '1px solid ' + t.border,
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy code'}
              </button>
              <button
                onClick={onClose}
                className='w-7 h-7 flex items-center justify-center rounded-lg'
                style={{ color: t.textSecondary }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div
            className='flex-1 overflow-hidden'
            style={{ height: 'calc(85vh - 52px)', minHeight: 0 }}
          >
            {isNative ? (
              <div className='flex flex-col items-center justify-center h-full gap-4 px-8 text-center'>
                <div
                  className='w-14 h-14 rounded-2xl flex items-center justify-center'
                  style={{ background: t.cardBg, border: '1px solid ' + t.border }}
                >
                  <ExternalLink size={24} style={{ color: t.textSecondary }} />
                </div>
                <div>
                  <p
                    className='text-sm font-semibold mb-2'
                    style={{ color: t.text, fontFamily: t.fontFamily }}
                  >
                    {t.labelPrefix ? '// REACT NATIVE DETECTED_' : 'React Native component'}
                  </p>
                  <p
                    className='text-xs mb-4'
                    style={{ color: t.textSecondary, fontFamily: t.fontFamily }}
                  >
                    React Native preview is not available in the browser. Test it directly in Expo
                    Snack.
                  </p>

                  <a
                    href='https://snack.expo.dev'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-colors'
                    style={{
                      background: t.accent,
                      color: t.bg,
                      fontFamily: t.fontFamily,
                    }}
                  >
                    <ExternalLink size={12} />
                    Open Expo Snack
                  </a>
                </div>
              </div>
            ) : (
              <SandpackProvider
                template='react'
                files={{
                  '/App.js':
                    code.replace(/export default /g, 'const __Component = ') +
                    '\nexport default __Component;',
                }}
                customSetup={{
                  dependencies: {
                    'lucide-react': 'latest',
                  },
                }}
                options={{
                  externalResources: ['https://cdn.tailwindcss.com'],
                }}
              >
                <SandpackPreview
                  style={{ height: '100%', width: '100%', minHeight: 0 }}
                  showNavigator={false}
                  showOpenInCodeSandbox={false}
                  showRefreshButton={true}
                />
              </SandpackProvider>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';

interface FileContent {
  name: string;
  content: string;
}

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  fileContent: FileContent | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileChange: (file: FileContent | null) => void;
}

export default function ChatInput({
  input,
  isLoading,
  fileContent,
  onInputChange,
  onSubmit,
  onFileChange,
}: ChatInputProps) {
  const { t } = useTheme();

  return (
    <div
      className='px-6 py-4'
      style={{
        background: t.surface,
        borderTop: `1px solid ${t.border}`,
      }}
    >
      {fileContent && (
        <div
          className='flex items-center gap-2 mb-3 px-3 py-2 rounded-xl w-fit'
          style={{
            background: t.userBubbleBg,
            border: `1px solid ${t.border}`,
          }}
        >
          <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
            <rect
              x='1.5'
              y='0.5'
              width='7'
              height='10'
              rx='1'
              stroke={t.userBubbleText}
              strokeOpacity='0.6'
              strokeWidth='1'
            />
            <path
              d='M3 4h5M3 6h4'
              stroke={t.userBubbleText}
              strokeOpacity='0.6'
              strokeWidth='0.8'
              strokeLinecap='round'
            />
          </svg>
          <span
            className='text-xs font-medium'
            style={{ color: t.userBubbleText, fontFamily: t.fontFamily }}
          >
            {t.labelPrefix ? `> ${fileContent.name}_` : fileContent.name}
          </span>
          <button
            onClick={() => onFileChange(null)}
            className='text-sm leading-none ml-1'
            style={{ color: t.userBubbleText, opacity: 0.5 }}
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={onSubmit} className='flex gap-2 items-center'>
        <input
          value={input}
          onChange={onInputChange}
          placeholder={
            t.labelPrefix ? '> Enter command..._' : 'Ask a question or give an instruction...'
          }
          disabled={isLoading}
          className='flex-1 px-4 py-3 text-sm rounded-2xl outline-none transition-all disabled:opacity-50'
          style={{
            background: t.inputBg,
            border: `1px solid ${t.border}`,
            color: t.text,
            fontFamily: t.fontFamily,
          }}
        />

        <label
          className='cursor-pointer flex items-center justify-center w-11 h-11 rounded-2xl transition-colors'
          style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
          }}
        >
          <svg width='15' height='15' viewBox='0 0 15 15' fill='none'>
            <rect
              x='1'
              y='2.5'
              width='12'
              height='10'
              rx='2'
              stroke={t.textSecondary}
              strokeWidth='1'
            />
            <path
              d='M5 2.5V1.5h5v1'
              stroke={t.textSecondary}
              strokeWidth='1'
              strokeLinecap='round'
            />
          </svg>
          <input
            type='file'
            accept='.ts,.tsx,.js,.jsx,.json,.css'
            className='hidden'
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const content = await file.text();
              onFileChange({ name: file.name, content: content.slice(0, 2000) });
              e.target.value = '';
            }}
          />
        </label>

        <button
          type='submit'
          disabled={isLoading || !input.trim()}
          className='w-11 h-11 flex items-center justify-center rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed'
          style={{
            background: t.accent,
            color: t.bg,
          }}
        >
          {isLoading ? (
            <div
              className='w-4 h-4 border-2 rounded-full animate-spin'
              style={{
                borderColor: `${t.bg}30`,
                borderTopColor: t.bg,
              }}
            />
          ) : (
            <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
              <path
                d='M3 8h10M9 4l4 4-4 4'
                stroke={t.bg}
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}

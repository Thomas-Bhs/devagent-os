import { cn } from '@/app/lib/utils';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';

interface ToolPillProps {
  toolName: string;
  state: 'running' | 'completed';
}

export default function ToolPill({ toolName, state }: ToolPillProps) {
  const { t } = useTheme();
  const isRunning = state === 'running';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full mb-2'
      )}
      style={{
        background: isRunning ? t.pillRunningBg : t.pillCompletedBg,
        color: isRunning ? t.pillRunningText : t.pillCompletedText,
        fontFamily: t.fontFamily,
        border: `1px solid ${isRunning ? t.pillRunningBg : t.pillCompletedBg}`,
      }}
    >
      <div
        className={cn('w-1.5 h-1.5 rounded-full', isRunning && 'animate-pulse')}
        style={{ background: isRunning ? t.pillRunningText : t.pillCompletedText }}
      />
      {formatLabel(t, toolName)} —{' '}
      {isRunning ? formatLabel(t, 'running') : formatLabel(t, 'completed')}
    </div>
  );
}

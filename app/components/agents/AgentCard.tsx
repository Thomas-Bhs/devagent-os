import { cn } from '@/app/lib/utils';
import { useTheme } from '@/app/context/ThemeContext';
import { formatLabel } from '@/app/lib/theme';

interface AgentCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  badge: 'active' | 'ready' | 'soon';
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  agentId: string;
}

const badgeConfig = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  ready: { label: 'Ready', className: 'bg-blue-100 text-blue-700' },
  soon: { label: 'Soon', className: 'bg-gray-100 text-gray-500' },
};

const LockIcon = () => (
  <svg width='10' height='10' viewBox='0 0 10 10' fill='none'>
    <rect x='1.5' y='4.5' width='7' height='5' rx='1' stroke='currentColor' strokeWidth='1.2' />
    <path
      d='M3 4.5V3a2 2 0 014 0v1.5'
      stroke='currentColor'
      strokeWidth='1.2'
      strokeLinecap='round'
    />
  </svg>
);

export default function AgentCard({
  name,
  description,
  icon,
  iconBg,
  badge,
  isSelected = false,
  isDisabled = false,
  onClick,
  agentId,
}: AgentCardProps) {
  const { t } = useTheme();
  const isFallout = !!t.labelPrefix;

  if (isFallout) {
    return (
      <div
        onClick={onClick}
        className={cn(
          'p-2 rounded-2xl transition-all duration-150 relative',
          isDisabled ? 'opacity-40 cursor-pointer' : 'cursor-pointer hover:scale-105',
          isSelected ? 'fallout-selected' : ''
        )}
        style={{
          background: isSelected ? t.cardBg : t.surface,
          border: `1px solid ${isSelected ? t.border : t.cardBorder}`,
        }}
      >
        <div className='w-full h-28 mb-2'>
          <img
            src={`/agents/${agentId}.webp`}
            alt={name}
            className='object-contain w-full h-full'
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <p
          className='text-[10px] font-bold text-center uppercase tracking-wider'
          style={{ color: t.border, fontFamily: t.fontFamily }}
        >
          {name}
        </p>
        {isDisabled && (
          <div
            className='absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 rounded-full'
            style={{ background: t.surface, border: `1px solid ${t.border}`, color: t.border }}
          >
            <LockIcon />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-2xl border transition-all duration-150 relative',
        isDisabled
          ? 'cursor-pointer border-gray-100 bg-gray-50 opacity-60'
          : 'cursor-pointer',
        !isDisabled && isSelected
          ? 'border-gray-950 bg-gray-950'
          : !isDisabled
            ? 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
            : ''
      )}
    >
      {isDisabled && (
        <div className='absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400'>
          <LockIcon />
        </div>
      )}

      <div
        className='w-8 h-8 rounded-xl flex items-center justify-center mb-2.5'
        style={{ background: isDisabled ? '#f3f4f6' : isSelected ? 'rgba(255,255,255,0.1)' : iconBg }}
      >
        {icon}
      </div>

      <p
        className={cn(
          'text-xs font-bold mb-0.5 tracking-tight',
          isDisabled ? 'text-gray-400' : isSelected ? 'text-white' : 'text-gray-900'
        )}
      >
        {name}
      </p>

      <p
        className={cn(
          'text-[10px] leading-snug mb-2',
          isDisabled ? 'text-gray-300' : isSelected ? 'text-gray-400' : 'text-gray-500'
        )}
      >
        {description}
      </p>

      <span
        className={cn(
          'inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide',
          isDisabled
            ? 'bg-gray-100 text-gray-400'
            : isSelected
              ? 'bg-white/10 text-white/60'
              : badgeConfig[badge].className
        )}
      >
        {isDisabled ? (
          <span className='flex items-center gap-0.5'>
            <LockIcon />
            {formatLabel(t, 'Upgrade')}
          </span>
        ) : (
          formatLabel(t, badgeConfig[badge].label)
        )}
      </span>
    </div>
  );
}

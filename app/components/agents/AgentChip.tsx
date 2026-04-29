import { cn } from '@/app/lib/utils';

interface AgentChipProps {
  name: string;
  hexColor: string;
}

export default function AgentChip({ name, hexColor }: AgentChipProps) {
  return (
    <div
      className='flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border'
      style={{
        background: `${hexColor}15`,
        color: hexColor,
        borderColor: `${hexColor}40`,
      }}
    >
      <div className='w-1.5 h-1.5 rounded-full' style={{ background: hexColor }} />
      {name}
    </div>
  );
}

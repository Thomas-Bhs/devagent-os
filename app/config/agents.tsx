export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  badge: 'active' | 'ready' | 'soon';
  color: string;
  isDisabled: boolean;
  route: string;
  chipColor: 'indigo' | 'amber' | 'green' | 'purple' | 'sky';
  icon: React.ReactNode;
}

export const AGENTS: AgentConfig[] = [
  {
    id: 'dev',
    name: 'Dev',
    description: 'Code, components, architecture',
    iconBg: '#dbeafe',
    badge: 'active',
    color: '#2563eb',
    isDisabled: false,
    route: '/api/agents/dev',
    chipColor: 'indigo',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M5 7L2 9l3 2'
          stroke='#2563eb'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path
          d='M13 7l3 2-3 2'
          stroke='#2563eb'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path d='M10.5 4l-3 10' stroke='#2563eb' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    id: 'debug',
    name: 'Debug',
    description: 'Errors, logs, fixes',
    iconBg: '#fee2e2',
    badge: 'active',
    color: '#dc2626',
    isDisabled: false,
    route: '/api/agents/debug',
    chipColor: 'amber',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M9 3a4 4 0 014 4v2a4 4 0 01-8 0V7a4 4 0 014-4z'
          stroke='#dc2626'
          strokeWidth='1.5'
        />
        <path
          d='M5 8H2M16 8h-3M9 13v2M6 15.5h6'
          stroke='#dc2626'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
        <path d='M5.5 5L3 3M12.5 5L15 3' stroke='#dc2626' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
    ),
  },
  {
    id: 'uiux',
    name: 'UI/UX',
    description: 'Design, visual components',
    iconBg: '#fae8ff',
    badge: 'active',
    color: '#a21caf',
    isDisabled: false,
    route: '/api/agents/uiux',
    chipColor: 'purple',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <rect x='2' y='2' width='6' height='6' rx='1.5' stroke='#a21caf' strokeWidth='1.5' />
        <rect
          x='10'
          y='2'
          width='6'
          height='6'
          rx='1.5'
          stroke='#a21caf'
          strokeWidth='1.5'
          strokeDasharray='2 1'
        />
        <rect
          x='2'
          y='10'
          width='6'
          height='6'
          rx='1.5'
          stroke='#a21caf'
          strokeWidth='1.5'
          strokeDasharray='2 1'
        />
        <rect x='10' y='10' width='6' height='6' rx='1.5' stroke='#a21caf' strokeWidth='1.5' />
      </svg>
    ),
  },
  {
    id: 'qa',
    name: 'QA',
    description: 'Tests, quality, coverage',
    iconBg: '#dcfce7',
    badge: 'active',
    color: '#16a34a',
    isDisabled: false,
    route: '/api/agents/qa',
    chipColor: 'green',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M3 9l4 4 8-8'
          stroke='#16a34a'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <circle cx='9' cy='9' r='7' stroke='#16a34a' strokeWidth='1.5' />
      </svg>
    ),
  },
  {
    id: 'designer',
    name: 'Designer',
    description: 'Mockups, style guide',
    iconBg: '#fff7ed',
    badge: 'active',
    color: '#ea580c',
    isDisabled: false,
    route: '/api/agents/designer',
    chipColor: 'sky',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <path
          d='M3 15l3-1 8-8-2-2-8 8-1 3z'
          stroke='#ea580c'
          strokeWidth='1.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <path d='M12 4l2 2' stroke='#ea580c' strokeWidth='1.5' strokeLinecap='round' />
        <circle cx='5.5' cy='12.5' r='1' fill='#ea580c' />
      </svg>
    ),
  },
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    description: 'Coordinates agents',
    iconBg: '#e0f2fe',
    badge: 'active',
    color: '#0284c7',
    isDisabled: false,
    route: '/api/agents/orchestrator',
    chipColor: 'sky',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none'>
        <circle cx='9' cy='4' r='2' stroke='#0284c7' strokeWidth='1.5' />
        <circle cx='3' cy='14' r='2' stroke='#0284c7' strokeWidth='1.5' />
        <circle cx='15' cy='14' r='2' stroke='#0284c7' strokeWidth='1.5' />
        <path
          d='M9 6v3M9 9l-4.5 3M9 9l4.5 3'
          stroke='#0284c7'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </svg>
    ),
  },
];

export function getAgentById(id: string): AgentConfig | undefined {
  return AGENTS.find((a) => a.id === id);
}

export function getAgentRoute(id: string): string {
  return getAgentById(id)?.route || '/api/agents/dev';
}

export function getAgentChipColor(id: string): 'indigo' | 'amber' | 'green' | 'purple' | 'sky' {
  return getAgentById(id)?.chipColor || 'indigo';
}

import { PlanConfig } from '@/app/types/subscription';

export const PLANS: Record<string, PlanConfig> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 7,
    stripePriceId: process.env.STRIPE_PRICE_ID_STARTER!,
    requestsPerMonth: 800,
    agents: ['Dev', 'Debug', 'QA'],
    features: [
      '800 requests / month',
      'Dev, Debug, QA agents',
      'Conversation history',
      'Email support',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 15,
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO!,
    requestsPerMonth: 1500,
    agents: ['Dev', 'Debug', 'QA', 'UI/UX', 'Designer'],
    features: [
      '1,500 requests / month',
      '5 specialized agents',
      'Conversation history',
      'File upload',
      'Priority support',
    ],
    isPopular: true,
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    price: 24,
    stripePriceId: process.env.STRIPE_PRICE_ID_EXPERT!,
    requestsPerMonth: 3000,
    agents: ['Dev', 'Debug', 'QA', 'UI/UX', 'Designer', 'Orchestrator'],
    features: [
      '3,000 requests / month',
      'All agents + Orchestrator',
      'Automated pipelines',
      'Advanced token dashboard',
      'Priority support',
    ],
  },
};

export const FREE_TRIAL_REQUESTS = 20;
export const FREE_AGENTS = ['dev', 'debug', 'qa'];

const PLAN_AGENT_NAME_TO_ID: Record<string, string> = {
  dev: 'dev',
  debug: 'debug',
  qa: 'qa',
  'ui/ux': 'uiux',
  designer: 'designer',
  orchestrator: 'orchestrator',
};

export function getAllowedAgentIds(planId: string | null | undefined): string[] {
  if (!planId) return FREE_AGENTS;
  const plan = PLANS[planId];
  if (!plan) return FREE_AGENTS;
  return plan.agents
    .map((name) => PLAN_AGENT_NAME_TO_ID[name.toLowerCase()])
    .filter(Boolean) as string[];
}

export function getMinPlanForAgent(agentId: string): string {
  for (const planId of ['starter', 'pro', 'expert']) {
    const plan = PLANS[planId];
    const ids = plan.agents
      .map((name) => PLAN_AGENT_NAME_TO_ID[name.toLowerCase()])
      .filter(Boolean);
    if (ids.includes(agentId)) return planId;
  }
  return 'starter';
}

export function getPlanByPriceId(priceId: string): PlanConfig | undefined {
  return Object.values(PLANS).find((p) => p.stripePriceId === priceId);
}

export function getRequestsLimit(planId: string): number {
  return PLANS[planId]?.requestsPerMonth ?? FREE_TRIAL_REQUESTS;
}

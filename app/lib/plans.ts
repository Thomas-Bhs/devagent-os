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

export function getPlanByPriceId(priceId: string): PlanConfig | undefined {
  return Object.values(PLANS).find((p) => p.stripePriceId === priceId);
}

export function getRequestsLimit(planId: string): number {
  return PLANS[planId]?.requestsPerMonth ?? FREE_TRIAL_REQUESTS;
}

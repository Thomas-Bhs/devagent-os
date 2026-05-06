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
      '800 requêtes / mois',
      'Agents Dev, Debug, QA',
      'Historique conversations',
      'Support email',
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
      '1 500 requêtes / mois',
      '5 agents spécialisés',
      'Historique conversations',
      'File upload',
      'Support prioritaire',
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
      '3 000 requêtes / mois',
      'Tous les agents + Orchestrator',
      'Pipelines automatiques',
      'Token dashboard avancé',
      'Support prioritaire',
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

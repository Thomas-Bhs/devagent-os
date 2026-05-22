import { NextResponse } from 'next/server';

export type PlanId = 'starter' | 'pro' | 'expert';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete';

export interface Subscription {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageTracking {
  userId: string;
  monthYear: string;
  requestsUsed: number;
  requestsLimit: number;
  resetDate: Date;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number;
  stripePriceId: string;
  requestsPerMonth: number;
  agents: string[];
  features: string[];
  isPopular?: boolean;
}

export interface GuardResult {
  authorized: boolean;
  response?: NextResponse;
  userId?: string;
}

'use client';

import { useEffect, useState } from 'react';
import { PlanId } from '@/app/types/subscription';

interface BillingData {
  plan: PlanId;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  requestsUsed: number;
  requestsLimit: number;
}

interface UseBillingReturn {
  billing: BillingData | null;
  loading: boolean;
  error: string | null;
}

export function useBilling(): UseBillingReturn {
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await fetch('/api/billing');

        // 404 = no billing data
        if (res.status === 404) {
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch billing');
        const data = await res.json();
        setBilling(data);
      } catch (err) {
        setError('Failed to load billing data');
        console.error('[useBilling]', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, []);

  return { billing, loading, error };
}

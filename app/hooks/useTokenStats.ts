import { useState, useEffect } from 'react';

export interface TokenStats {
  today: { tokens: number; cost: number };
  week: { tokens: number; cost: number };
  month: { tokens: number; cost: number };
  byAgent: { agent: string; tokens: number; cost: number }[];
}

export function useTokenStats(isOpen: boolean) {
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const totalAgentTokens = stats?.byAgent.reduce((acc, a) => acc + a.tokens, 0) || 1;

  return { stats, loading, error, totalAgentTokens };
}

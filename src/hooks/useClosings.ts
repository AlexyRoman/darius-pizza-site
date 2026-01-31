'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadRestaurantConfig } from '@/lib/restaurant-config';
import type { ClosingsConfig } from '@/types/restaurant-config';

type UseClosingsResult = {
  data: ClosingsConfig | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useClosings(locale?: string): UseClosingsResult {
  const [data, setData] = useState<ClosingsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const effectiveLocale = locale || 'en';

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/closings?locale=${effectiveLocale}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch closings');
      const json = (await res.json()) as ClosingsConfig;
      setData(json);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch closings')
      );
      try {
        const fallback = await loadRestaurantConfig(
          'closings',
          effectiveLocale
        );
        setData(fallback);
      } catch {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [effectiveLocale]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

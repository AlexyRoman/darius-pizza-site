'use client';

import { useState, useEffect, useCallback } from 'react';

import type { HoursConfig } from '@/types/restaurant-config';

import staticHours from '@/content/restaurant/hours.json';

const defaultHours = staticHours as HoursConfig;

type UseHoursResult = {
  data: HoursConfig;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

/**
 * Fetches opening hours from /api/hours.
 * Uses static hours as initial/fallback so there's no flash.
 * Refetch after dashboard save to see changes.
 */
export function useHours(): UseHoursResult {
  const [data, setData] = useState<HoursConfig>(defaultHours);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/hours?_=${Date.now()}`, {
        cache: 'no-store',
        headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) throw new Error('Failed to fetch hours');
      const json = (await res.json()) as HoursConfig;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hours'));
      setData(defaultHours);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

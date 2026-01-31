'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadRestaurantConfig } from '@/lib/restaurant-config';
import type { MessagesConfig } from '@/types/restaurant-config';

type UseMessagesResult = {
  data: MessagesConfig | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useMessages(locale?: string): UseMessagesResult {
  const [data, setData] = useState<MessagesConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const effectiveLocale = locale || 'en';

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/messages?locale=${effectiveLocale}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch messages');
      const json = (await res.json()) as MessagesConfig;
      setData(json);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch messages')
      );
      try {
        const fallback = await loadRestaurantConfig(
          'messages',
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

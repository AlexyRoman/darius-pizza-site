'use client';

import { useCallback, useEffect, useState } from 'react';

type AuthState = {
  authenticated: boolean | null;
  loading: boolean;
  check: () => Promise<void>;
};

/**
 * Client-side hook to check authentication status via /api/auth/check.
 * Use for conditional UI (e.g. showing logout) in protected areas.
 */
export function useAuth(): AuthState {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/check');
      setAuthenticated(res.ok);
    } catch {
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { authenticated, loading, check };
}

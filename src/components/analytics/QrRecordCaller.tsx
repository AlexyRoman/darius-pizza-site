'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

/** QR record runs regardless of cookie consent; qr_counted is a strictly necessary cookie (bypass). */
const CODE_PATTERN = /^[A-Za-z0-9]{4}$/;

function isValidCode(value: string | null): boolean {
  return (
    !!value && typeof value === 'string' && CODE_PATTERN.test(value.trim())
  );
}

function isLandingPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const segments = pathname.split('/').filter(Boolean);
  return segments.length <= 1;
}

export function QrRecordCaller() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const code = searchParams.get('qr');

  useQuery({
    queryKey: ['qr-record', code ?? ''],
    queryFn: async () => {
      const res = await fetch(
        `/api/analytics/qr?code=${encodeURIComponent(code!)}`
      );
      if (!res.ok) throw new Error('QR record failed');
      return null;
    },
    enabled: isLandingPath(pathname) && isValidCode(code),
    staleTime: Infinity,
    gcTime: 0,
    retry: false,
  });

  return null;
}

'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { routing } from '@/i18n/routing';

/**
 * Client component that updates html lang attribute on navigation
 * This handles client-side navigation which doesn't reload the page
 */
export function HtmlLangSetter() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    const locale =
      routing.locales.includes(firstSegment) && firstSegment
        ? firstSegment
        : routing.defaultLocale;

    document.documentElement.setAttribute('lang', locale);
  }, [pathname]);

  return null;
}

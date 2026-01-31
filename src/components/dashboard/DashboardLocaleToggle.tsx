'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { FlagIcon, codeToCountry } from '@/lib/i18n/flags';
import { Button } from '@/components/ui/button';

const DASHBOARD_LOCALES = ['en', 'fr'] as const;

export function DashboardLocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname?.split('/').filter(Boolean)[0] || 'en';
  const displayLocale = DASHBOARD_LOCALES.includes(
    currentLocale as (typeof DASHBOARD_LOCALES)[number]
  )
    ? currentLocale
    : 'en';

  const nextLocale = displayLocale === 'en' ? 'fr' : 'en';

  const switchLocale = useCallback(
    (code: string) => {
      if (!pathname || code === displayLocale) return;
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        segments[0] = code;
      }
      router.push('/' + segments.join('/') || '/');
    },
    [pathname, displayLocale, router]
  );

  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label={`Switch to ${nextLocale === 'en' ? 'English' : 'Français'}`}
      className='size-8 shrink-0 overflow-hidden rounded-md border border-sidebar-border bg-sidebar-accent/50 p-0.5 hover:bg-sidebar-accent'
      onClick={() => switchLocale(nextLocale)}
    >
      <FlagIcon code={codeToCountry(displayLocale)} size={18} />
    </Button>
  );
}

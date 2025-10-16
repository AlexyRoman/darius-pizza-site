'use client';

import * as React from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { getAvailableLocales, getEnabledLocaleCodes } from '@/config/locales-config';

function codeToCountry(code: string): string {
  switch (code) {
    case 'en':
      return 'EN-CUSTOM';
    case 'fr':
      return 'FR';
    default:
      return code.toUpperCase();
  }
}

function FlagIcon({ code, size = 20 }: { code: string; size?: number }) {
  if (code === 'EN-CUSTOM') {
    return (
      <Image
        src={'/flags/en.svg'}
        width={size}
        height={Math.round((size * 3) / 4)}
        alt='English'
        className='block rounded-[3px]'
        priority={false}
      />
    );
  }
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: Math.round((size * 3) / 4),
        borderRadius: 3,
        background: '#e5e7eb',
      }}
      aria-hidden
    />
  );
}

export function LocaleToggle({ currentLocale }: { currentLocale: string }) {
  const locales = getAvailableLocales();
  const router = useRouter();
  const pathname = usePathname();
  const enabled = React.useMemo(() => new Set<string>(getEnabledLocaleCodes()), []);

  const displayLocale = React.useMemo<string>(() => {
    if (!pathname) return currentLocale;
    const seg = pathname.split('/').filter(Boolean)[0];
    return seg && enabled.has(seg) ? seg : currentLocale;
  }, [pathname, currentLocale, enabled]);

  const onSelect = (code: string) => {
    if (!pathname) return;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && enabled.has(segments[0])) {
      segments.shift();
    }
    const next = '/' + [code, ...segments].join('/');
    router.push(next || '/');
  };

  return (
    <div className='flex items-center gap-2'>
      <button aria-label='Current language' className='p-2'>
        <FlagIcon code={codeToCountry(displayLocale)} size={20} />
      </button>
      {locales.map(loc => (
        <button
          key={loc.code}
          onClick={() => onSelect(loc.code)}
          className='px-2 py-1 text-sm rounded border'
          aria-label={`Switch to ${loc.nativeName}`}
        >
          {loc.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default LocaleToggle;



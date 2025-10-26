'use client';

import * as React from 'react';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import {
  getAllLocales,
  getEnabledLocaleCodes,
  isLocaleEnabled,
  getDefaultLocale,
} from '@/config/locales-config';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import ReactCountryFlag from 'react-country-flag';
import { Button } from '@/components/ui/button';
import { withRateLimit, withThrottle } from '@/lib/pacer';
import { motion, AnimatePresence } from 'framer-motion';

function codeToCountry(code: string): string {
  switch (code) {
    case 'en':
      return 'EN-CUSTOM';
    case 'fr':
      return 'FR';
    case 'nl':
      return 'NL';
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
        className='block rounded-full overflow-hidden'
        priority={false}
      />
    );
  }
  return (
    <ReactCountryFlag
      svg
      countryCode={code}
      style={{
        width: size,
        height: Math.round((size * 3) / 4),
        borderRadius: 999,
      }}
    />
  );
}

export function LocaleToggle({
  currentLocale,
  isMobile = false,
  expanded = false,
}: {
  currentLocale: string;
  isMobile?: boolean;
  expanded?: boolean;
}) {
  const locales = getAllLocales();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const enabled = React.useMemo<Set<string>>(
    () => new Set<string>(getEnabledLocaleCodes()),
    []
  );

  const displayLocale = React.useMemo(() => {
    if (!pathname) return currentLocale;
    const seg = pathname.split('/').filter(Boolean)[0];
    return seg && enabled.has(seg) ? seg : currentLocale;
  }, [pathname, currentLocale, enabled]);

  const onSelect = withRateLimit(
    withThrottle((code: string) => {
      if (!pathname) return;
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0 && enabled.has(segments[0])) {
        segments.shift();
      }
      const targetCode = isLocaleEnabled(code) ? code : getDefaultLocale();
      const next = '/' + [targetCode, ...segments].join('/');
      router.push(next || '/');
      if (isMobile) {
        setIsOpen(false);
      }
    }, 400)
  );

  // Mobile version with vertical column of flag buttons
  if (isMobile) {
    return (
      <div className='relative'>
        <Button
          variant='ghost'
          size='icon'
          aria-label='Change language'
          className='rounded-full overflow-hidden border-2 border-orange-500 bg-transparent shadow-none ring-2 ring-orange-500/50'
          onClick={() => !expanded && setIsOpen(!isOpen)}
        >
          <FlagIcon code={codeToCountry(displayLocale)} size={16} />
        </Button>

        <AnimatePresence>
          {(isOpen || expanded) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className='absolute bottom-full left-0 mb-2 z-50'
            >
              <div className='flex flex-col gap-2'>
                {locales
                  .filter(loc => loc.code !== displayLocale)
                  .map((loc, index) => (
                    <motion.div
                      key={loc.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant='outline'
                        size='icon'
                        aria-label={`Switch to ${loc.nativeName}`}
                        className='rounded-full border border-border/50 bg-background backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background hover:bg-background active:bg-background focus:bg-background focus-visible:outline-none focus:outline-none focus:ring-0'
                        onClick={() => onSelect(loc.code)}
                      >
                        <FlagIcon code={codeToCountry(loc.code)} size={16} />
                      </Button>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop version with dropdown menu
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant='ghost'
          size='icon'
          aria-label='Change language'
          className='rounded-full overflow-hidden border-0 bg-transparent shadow-none'
        >
          <FlagIcon code={codeToCountry(displayLocale)} size={16} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align='start'
          alignOffset={12}
          className='z-50 min-w-40 rounded-md border border-border/50 bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 p-1 text-popover-foreground shadow-md focus:outline-none'
        >
          {locales.map(loc => (
            <DropdownMenu.Item
              key={loc.code}
              className='flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground'
              onSelect={() => onSelect(loc.code)}
            >
              <FlagIcon code={codeToCountry(loc.code)} size={16} />
              <span className='font-medium uppercase'>{loc.code}</span>
              <span className='text-muted-foreground'>{loc.nativeName}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default LocaleToggle;

'use client';

'use client';
import React from 'react';
import Link from 'next/link';

import { Home, Phone, Info, UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { LocaleToggle } from '@/components/header/LocaleToggle';
import { ThemeToggle } from '@/components/header/ThemeToggle';
import RadialSettings from '@/components/header/RadialSettings';
//
import { TimeClock } from '@/components/header/TimeClock';
import { Button, buttonVariants } from '@/components/ui/button';
import { PAGES } from '@/config/pages';
import { getSiteTimeZone, getSitePhone } from '@/config/site';
import { cn } from '@/lib/utils';

export function Header({
  currentLocale = 'en',
}: { currentLocale?: string } = {}) {
  const t = useTranslations('common');
  const locale = currentLocale;
  const timeZone = getSiteTimeZone();

  const withLocale = (path: string): string => {
    if (path === '/') return `/${locale}`;
    return `/${locale}${path}`;
  };

  const nav = [
    { href: withLocale(PAGES.home.path), label: t('home'), icon: <Home /> },
    {
      href: withLocale(PAGES.menu.path),
      label: t('menu'),
      icon: <UtensilsCrossed />,
    },
    { href: withLocale(PAGES.info.path), label: t('info'), icon: <Info /> },
  ];

  return (
    <>
      <header className='fixed inset-x-0 top-0 z-50 hidden md:block'>
        <div className='mx-auto max-w-5xl px-4'>
          <div className='flex h-16 items-center justify-between'>
            <div className='rounded-full border border-white/10 ring-1 ring-border bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 px-3 py-1 shadow-sm'>
              <TimeClock timeZone={timeZone} locale={locale} />
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex items-center gap-1 rounded-full border border-white/10 ring-1 ring-border bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 px-1.5 py-1 shadow-sm'>
                <nav className='flex items-center gap-1'>
                  {nav.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-label={item.label}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'sm' }),
                        'data-[active=true]:bg-accent/60'
                      )}
                    >
                      <span className='mr-2 [&_svg]:size-4'>{item.icon}</span>
                      <span className='hidden sm:inline-block'>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </nav>
                <div
                  aria-hidden
                  className='mx-2 h-6 w-[1px] shrink-0 bg-border'
                />
                {/* Desktop: plain buttons (no glass wrapper) */}
                <div className='hidden md:flex items-center gap-1'>
                  <ThemeToggle />
                  <LocaleToggle currentLocale={locale} />
                </div>
              </div>
            </div>
            <Button
              asChild
              size='lg'
              className='rounded-full border border-white/10 ring-1 ring-border bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 px-6 hover:bg-background/30 active:bg-background/30 focus:bg-background/30 focus-visible:outline-none focus:outline-none focus:ring-0 select-none'
            >
              <a href={`tel:${getSitePhone()}`} aria-label='Call'>
                <span className='inline-flex items-center gap-2 text-foreground'>
                  <Phone className='h-5 w-5 text-foreground' />
                  {t('call')}
                </span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className='fixed inset-x-0 bottom-0 z-50 md:hidden'>
        <div className='relative mx-auto h-[4.5rem] max-w-lg'>
          <nav className='relative z-10 mx-auto flex h-[4.5rem] max-w-lg items-center justify-center px-6 text-foreground pb-[env(safe-area-inset-bottom)]'>
            <div className='flex items-center gap-1 rounded-full border border-white/10 bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 px-1 py-1.5 shadow-sm'>
              <nav className='flex items-center gap-1'>
                {nav.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      '[&_svg]:size-5'
                    )}
                    aria-label={item.label}
                  >
                    {item.icon}
                  </Link>
                ))}
              </nav>
              {/* Theme/Locale removed from mobile navbar */}
            </div>
          </nav>
          <Button
            asChild
            size='icon'
            variant='ghost'
            className='md:hidden rounded-full shadow-lg absolute right-4 top-1/2 -translate-y-1/2 z-50 border border-white/10 ring-1 ring-border bg-background/40 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/40 h-12 w-12 hover:bg-background/40 active:bg-background/40 focus:bg-background/40 focus-visible:outline-none focus:outline-none focus:ring-0 select-none'
          >
            <a href={`tel:${getSitePhone()}`} aria-label='Call'>
              <Phone className='size-6 text-foreground' />
            </a>
          </Button>
          {/* Mobile settings radial menu bottom-left */}
          <div className='md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-50'>
            <RadialSettings currentLocale={locale} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

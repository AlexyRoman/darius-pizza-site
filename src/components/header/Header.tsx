'use client';

'use client';
import React, { useState } from 'react';
import Link from 'next/link';

import { Home, Phone, Info, Pizza } from 'lucide-react';
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
      icon: <Pizza />,
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
                  className='mx-2 h-6 w-[1px] shrink-0 bg-gray-400'
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
              className='rounded-full border border-white/10 ring-1 ring-border bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 px-6 hover:bg-primary hover:text-primary-foreground hover:border-primary/50 hover:ring-primary/50 active:bg-primary active:text-primary-foreground focus:bg-primary focus:text-primary-foreground focus-visible:outline-none focus:outline-none focus:ring-0 select-none transition-all duration-200'
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
            <div className='flex items-center gap-1 rounded-full border border-white/10 ring-1 ring-border bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 px-1 py-1.5 shadow-sm'>
              <nav className='flex items-center gap-1'>
                {nav.map((item, index) => (
                  <React.Fragment key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'icon' }),
                        '[&_svg]:size-5'
                      )}
                      aria-label={item.label}
                    >
                      {item.icon}
                    </Link>
                    {index < nav.length - 1 && (
                      <div
                        aria-hidden
                        className='mx-1 h-6 w-[1px] shrink-0 bg-gray-400'
                      />
                    )}
                  </React.Fragment>
                ))}
              </nav>
              {/* Theme/Locale removed from mobile navbar */}
            </div>
          </nav>
          <div
            className='md:hidden absolute right-4 top-1/2 z-50'
            style={{
              transform: 'translateY(-50%) !important',
              position: 'absolute',
              top: '50% !important',
              right: '1rem !important',
              transition: 'none !important',
              animation: 'none !important',
            }}
          >
            <Button
              asChild
              size='icon'
              variant='ghost'
              className='rounded-full shadow-lg border border-white/10 ring-1 ring-border bg-background/40 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/40 h-12 w-12 hover:bg-primary hover:text-primary-foreground hover:border-primary/50 hover:ring-primary/50 focus:bg-primary focus:text-primary-foreground focus-visible:outline-none focus:outline-none focus:ring-0 select-none'
              style={{
                transform: 'none !important',
                transition: 'none !important',
                animation: 'none !important',
                position: 'static',
              }}
            >
              <a
                href={`tel:${getSitePhone()}`}
                aria-label='Call'
                style={{
                  transform: 'none !important',
                  transition: 'none !important',
                  animation: 'none !important',
                }}
              >
                <Phone className='size-6 text-foreground' />
              </a>
            </Button>
          </div>
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

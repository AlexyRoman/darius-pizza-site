'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Phone, Info, Pizza } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LiquidGlassPill } from '@/components/header/LiquidGlassPill';
import RadialSettings from '@/components/header/RadialSettings';
import { TimeClock } from '@/components/header/TimeClock';
import { SmartCallButton } from '@/components/ui/smart-call-button';
import { PAGES } from '@/config/site/pages';
import { getSiteTimeZone } from '@/utils/site-utils';

const ThemeToggle = dynamic(
  () =>
    import('@/components/header/ThemeToggle').then(mod => ({
      default: mod.ThemeToggle,
    })),
  {
    ssr: false,
    loading: () => <div className='w-8 h-8' />,
  }
);

const LocaleToggle = dynamic(
  () =>
    import('@/components/header/LocaleToggle').then(mod => ({
      default: mod.LocaleToggle,
    })),
  {
    ssr: false,
    loading: () => <div className='w-8 h-8' />,
  }
);

type NavItem = {
  key: 'home' | 'menu' | 'info';
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function Header({
  currentLocale = 'en',
}: { currentLocale?: string } = {}) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');
  const displayLocale = currentLocale || locale;
  const timeZone = getSiteTimeZone();

  const withLocale = React.useCallback(
    (path: string): string => {
      if (path === '/') return `/${displayLocale}`;
      return `/${displayLocale}${path}`;
    },
    [displayLocale]
  );

  const nav: NavItem[] = React.useMemo(
    () => [
      {
        key: 'home',
        href: withLocale(PAGES.home.path),
        label: t('home'),
        icon: <Home className='size-4' />,
      },
      {
        key: 'menu',
        href: withLocale(PAGES.menu.path),
        label: t('menu'),
        icon: <Pizza className='size-4' />,
      },
      {
        key: 'info',
        href: withLocale(PAGES.info.path),
        label: t('info'),
        icon: <Info className='size-4' />,
      },
    ],
    [withLocale, t]
  );

  const mobileNav: NavItem[] = React.useMemo(
    () => [
      {
        key: 'home',
        href: withLocale(PAGES.home.path),
        label: t('home'),
        icon: <Home className='size-5' />,
      },
      {
        key: 'menu',
        href: withLocale(PAGES.menu.path),
        label: t('menu'),
        icon: <Pizza className='size-5' />,
      },
      {
        key: 'info',
        href: withLocale(PAGES.info.path),
        label: t('info'),
        icon: <Info className='size-5' />,
      },
    ],
    [withLocale, t]
  );

  const isActive = React.useCallback(
    (href: string) => {
      const target = withLocale(href);
      if (href === '/' || href === PAGES.home.path) {
        return pathname === target;
      }
      return pathname.startsWith(target);
    },
    [pathname, withLocale]
  );

  return (
    <>
      <header className='fixed inset-x-0 top-0 z-50 hidden md:block'>
        {/* Far left - timezone + live time */}
        <div
          className='absolute top-1/2 -translate-y-1/2 max-[820px]:hidden'
          style={{ left: '2rem' }}
        >
          <LiquidGlassPill className='px-3 py-1.5'>
            <TimeClock timeZone={timeZone} locale={displayLocale} />
          </LiquidGlassPill>
        </div>

        {/* Contact CTA - far right */}
        <div
          className='absolute top-1/2 -translate-y-1/2'
          style={{ right: '2rem' }}
        >
          <SmartCallButton
            size='lg'
            className='!bg-primary !text-primary-foreground rounded-full shadow-lg px-6 hover:!bg-primary active:!bg-primary focus:!bg-primary'
            aria-label={t('call')}
          >
            <span className='inline-flex items-center gap-2'>
              <Phone className='h-5 w-5' />
              {t('call')}
            </span>
          </SmartCallButton>
        </div>

        <div className='mx-auto max-w-5xl px-4'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex-1' />

            {/* Center - Navigation + Toggles */}
            <LiquidGlassPill className='flex items-center gap-1 px-1.5 py-1'>
              <nav className='flex items-center gap-1'>
                {nav.map(item => (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-label={item.label}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'sm' }),
                      'rounded-full',
                      isActive(PAGES[item.key].path) && 'bg-accent/60'
                    )}
                    {...(item.key === 'menu' && {
                      'data-gtm-click': 'menu_link',
                    })}
                  >
                    <span className='mr-2 [&_svg]:size-4'>{item.icon}</span>
                    <span className='hidden sm:inline-block'>{item.label}</span>
                  </Link>
                ))}
              </nav>

              <div
                aria-hidden
                className='mx-2 h-6 w-[1px] shrink-0 bg-gray-400/50'
              />

              <div className='flex items-center gap-1'>
                <ThemeToggle />
                <LocaleToggle currentLocale={displayLocale} />
              </div>
            </LiquidGlassPill>

            <div className='flex-1' />
          </div>
        </div>
      </header>

      {/* Mobile Navbar */}
      <div className='fixed inset-x-0 bottom-0 z-50 md:hidden'>
        <div className='relative mx-auto h-[4.5rem] max-w-lg'>
          <nav className='relative z-10 mx-auto flex h-[4.5rem] max-w-lg items-center justify-center px-6 text-foreground pb-[env(safe-area-inset-bottom)]'>
            <LiquidGlassPill className='flex items-center gap-1 px-1 py-1.5'>
              {mobileNav.map((item, index) => (
                <React.Fragment key={item.key}>
                  <Link
                    href={item.href}
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      '[&_svg]:size-5',
                      isActive(PAGES[item.key].path) && 'bg-accent/60'
                    )}
                    aria-label={item.label}
                    {...(item.key === 'menu' && {
                      'data-gtm-click': 'menu_link',
                    })}
                  >
                    {item.icon}
                  </Link>
                  {index < mobileNav.length - 1 && (
                    <div
                      aria-hidden
                      className='mx-1 h-6 w-[1px] shrink-0 bg-gray-400/50'
                    />
                  )}
                </React.Fragment>
              ))}
            </LiquidGlassPill>
          </nav>

          <div
            className='md:hidden fixed left-4 bottom-5 z-50'
            style={{ left: '1rem' }}
          >
            <RadialSettings currentLocale={displayLocale} />
          </div>

          <div className='md:hidden fixed right-4 bottom-3 z-40'>
            <SmartCallButton
              size='icon'
              className='!bg-primary !text-primary-foreground rounded-full shadow-lg h-12 w-12'
              aria-label={t('call')}
            >
              <Phone className='size-6 text-foreground' />
            </SmartCallButton>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

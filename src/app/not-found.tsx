'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Pizza } from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';

// Import locale files
import enMessages from '@/locales/en.json';
import deMessages from '@/locales/de.json';
import frMessages from '@/locales/fr.json';
import itMessages from '@/locales/it.json';
import esMessages from '@/locales/es.json';
import nlMessages from '@/locales/nl.json';

const allMessages = {
  en: enMessages,
  de: deMessages,
  fr: frMessages,
  it: itMessages,
  es: esMessages,
  nl: nlMessages,
};

// Component that uses translations (must be inside NextIntlClientProvider)
function NotFoundContent({ locale }: { locale: string }) {
  const homeUrl = `/${locale}`;
  const t = (key: keyof typeof allMessages.en.notFound) =>
    allMessages[locale as keyof typeof allMessages]?.notFound?.[key] ||
    allMessages.en.notFound[key];

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background-secondary to-background py-16'>
      {/* Background Effects */}
      <div className='absolute inset-0 -z-10'>
        {/* Gradient overlays */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80' />

        {/* Animated shapes */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse' />
        <div className='absolute top-40 right-20 w-24 h-24 bg-accent/15 rounded-full blur-lg animate-pulse' />
        <div className='absolute bottom-20 left-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-pulse' />

        {/* Grid pattern */}
        <div className='absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.foreground.DEFAULT)_1px,transparent_0)] [background-size:20px_20px]' />
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <div className='max-w-2xl mx-auto space-y-8'>
          {/* Pizza Icon */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl' />
              <div className='relative bg-background-elevated rounded-full p-8 shadow-2xl border border-border/50'>
                <Pizza className='w-16 h-16 text-primary animate-bounce' />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className='space-y-4'>
            <h1 className='text-6xl sm:text-7xl lg:text-8xl font-primary font-bold text-primary'>
              404
            </h1>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-primary font-semibold text-foreground'>
              {t('title')}
            </h2>
            <p className='text-lg sm:text-xl text-foreground-secondary font-secondary leading-relaxed max-w-xl mx-auto'>
              {t('message')}
            </p>
          </div>

          {/* CTA Button */}
          <div className='pt-8'>
            <Button
              asChild
              size='lg'
              className='h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group'
            >
              <Link
                href={homeUrl}
                className='flex items-center gap-2 justify-center'
              >
                <Home className='w-5 h-5 group-hover:scale-110 transition-transform' />
                {t('backHome')}
              </Link>
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className='flex justify-center space-x-4 pt-8'>
            <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
            <div className='w-2 h-2 bg-accent rounded-full animate-pulse' />
            <div className='w-2 h-2 bg-secondary rounded-full animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  const pathname = usePathname();
  const [locale, setLocale] = useState('en');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Extract locale from pathname
    const segments = pathname?.split('/').filter(Boolean) || [];
    const possibleLocale = segments[0];
    const validLocales = ['en', 'fr', 'de', 'it', 'es', 'nl'];

    if (possibleLocale && validLocales.includes(possibleLocale)) {
      setLocale(possibleLocale);
    } else {
      // Default to 'fr' if no locale found
      setLocale('fr');
    }
    setIsClient(true);
  }, [pathname]);

  // Get messages based on locale
  const messages =
    allMessages[locale as keyof typeof allMessages] || allMessages.en;

  // Show nothing on server to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <AppThemeProvider>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <div className='min-h-screen flex flex-col'>
          <Header currentLocale={locale} />
          <main className='pt-0 md:pt-16 pb-2 md:pb-0 flex-1'>
            <NotFoundContent locale={locale} />
          </main>
          <Footer
            currentLocale={locale}
            titles={{
              legal: messages.footer?.titles?.legal || 'Legal',
              social: messages.footer?.titles?.social || 'Social',
              explore: messages.footer?.titles?.explore || 'Explore',
            }}
            brandSubtitle={
              messages.footer?.brandSubtitle ||
              'Authentic pizza made with love, tradition, and the best ingredients.'
            }
            rightsReservedText={
              messages.footer?.rightsReserved ||
              'Darius Pizza. All rights reserved.'
            }
            designedByPrefix={
              messages.footer?.designedByPrefix || 'Designed by'
            }
            designedByName={
              messages.footer?.designedByName || 'WebOustaou - Alexy Roman'
            }
            legalLabels={{
              privacy: messages.footer?.legal?.privacy || 'Privacy',
              imprint: messages.footer?.legal?.imprint || 'Legal Notice',
              cookies: messages.footer?.legal?.cookies || 'Cookies',
            }}
            menuLabels={{
              home: messages.common?.home || 'Home',
              menu: messages.common?.menu || 'Menu',
              info: messages.common?.info || 'Info',
            }}
          />
        </div>
      </NextIntlClientProvider>
    </AppThemeProvider>
  );
}

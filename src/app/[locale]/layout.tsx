import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import CookieConsentBanner from '@/components/blocks/cookie-consent-banner';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import PageTracker from '@/components/analytics/PageTracker';
import AnalyticsDebug from '@/components/analytics/AnalyticsDebug';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import { fontPrimary, fontSecondary } from '@/lib/fonts';

async function getMessages(locale: string) {
  try {
    return (await import(`@/locales/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

export async function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export { generateViewport } from '@/lib/metadata';

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { children, params } = props;
  const { locale } = await params;
  const messages = await getMessages(locale);

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fontPrimary.variable} ${fontSecondary.variable}`}
    >
      <head>
        {/* DNS prefetch for external resources */}
        <link rel='dns-prefetch' href='https://fonts.googleapis.com' />
        <link rel='dns-prefetch' href='https://fonts.gstatic.com' />
        <link rel='dns-prefetch' href='https://www.googletagmanager.com' />

        {/* Theme color for mobile browsers - matches light theme background */}
        <meta name='theme-color' content='oklch(0.98 0.01 85)' />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: light)'
          content='oklch(0.98 0.01 85)'
        />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: dark)'
          content='oklch(0.12 0.02 45)'
        />

        {/* Apple-specific status bar configuration */}
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Darius Pizza' />

        {/* Additional mobile optimizations */}
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta
          name='msapplication-navbutton-color'
          content='oklch(0.98 0.01 85)'
        />
        <meta name='msapplication-TileColor' content='oklch(0.98 0.01 85)' />

        {/* Preload critical resources for LCP */}
        <link
          rel='preload'
          href='/static/hero-background.webp'
          as='image'
          type='image/webp'
          fetchPriority='high'
        />
        <link
          rel='preload'
          href='/static/hero-pizza.webp'
          as='image'
          type='image/webp'
          fetchPriority='high'
        />

        {/* Preload critical fonts - only bold weight for LCP */}
        <link
          rel='preload'
          href='/fonts/playfair-display-700.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
        <link
          rel='preload'
          href='/fonts/inter-400.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
      </head>
      <body className='font-secondary antialiased'>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "!function(){try{const t=localStorage.getItem('darius-pizza-theme'),e=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches,n='dark'===t||(!t&&e),r=document.documentElement;n?(r.classList.add('dark'),r.style.setProperty('--effective-theme','dark')):(r.classList.remove('dark'),r.style.setProperty('--effective-theme','light'))}catch(e){}}();",
          }}
        />
        <AppThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            {/* Google Consent Mode - MUST be before GTM */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  // Set default consent state to 'denied' BEFORE GTM loads
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied'
                  });
                `,
              }}
            />
            <GoogleTagManager
              gtmId={process.env.NEXT_PUBLIC_GTM_ID || ''}
              gaId={process.env.NEXT_PUBLIC_GA_ID || ''}
            />
            <PageTracker />
            <AnalyticsDebug />
            <Header currentLocale={locale} />
            <main className='pt-0 md:pt-16 pb-2 md:pb-0'>
              <div suppressHydrationWarning>{children}</div>
            </main>
            {/* Defer non-critical content */}
            <CookieConsentBanner />
            <Toaster />
            <Footer
              currentLocale={locale}
              titles={{
                legal: messages.footer.titles.legal,
                social: messages.footer.titles.social,
                explore: messages.footer.titles.explore,
              }}
              brandSubtitle={messages.footer.brandSubtitle}
              rightsReservedText={messages.footer.rightsReserved}
              designedByPrefix={messages.footer.designedByPrefix}
              designedByName={messages.footer.designedByName}
              legalLabels={{
                privacy: messages.footer.legal.privacy,
                imprint: messages.footer.legal.imprint,
                cookies: messages.footer.legal.cookies,
              }}
              menuLabels={{
                home: messages.common.home,
                menu: messages.common.menu,
                info: messages.common.info,
              }}
            />
          </NextIntlClientProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}

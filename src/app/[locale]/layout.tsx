import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import CookieConsentBanner from '@/components/blocks/cookie-consent-banner';
import GoogleTagManager from '@/components/analytics/GoogleTagManager';
import PageTracker from '@/components/analytics/PageTracker';
import AnalyticsDebug from '@/components/analytics/AnalyticsDebug';
import { Toaster } from '@/components/ui/sonner';
import { HtmlLangSetter } from '@/components/HtmlLangSetter';

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
    <NextIntlClientProvider messages={messages} locale={locale}>
      <HtmlLangSetter />
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
      {process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true' ? (
        <AnalyticsDebug />
      ) : null}
      {children}
      {/* Defer non-critical content */}
      <CookieConsentBanner />
      <Toaster />
    </NextIntlClientProvider>
  );
}

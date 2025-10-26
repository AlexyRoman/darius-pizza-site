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

import type { Metadata } from 'next';
import { generateLocalizedMetadata, generateViewport } from '@/lib/metadata';

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

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  return generateLocalizedMetadata({
    locale,
    path: '/',
    type: 'default',
  });
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
        {children}
        <CookieConsentBanner />
      </main>
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
          terms: messages.footer.legal.terms,
          imprint: messages.footer.legal.imprint,
        }}
        menuLabels={{
          home: messages.common.home,
          menu: messages.common.menu,
          info: messages.common.info,
        }}
      />
    </NextIntlClientProvider>
  );
}

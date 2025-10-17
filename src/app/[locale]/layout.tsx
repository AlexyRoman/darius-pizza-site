import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { routing } from '@/i18n/routing';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

import type { Metadata } from 'next';
import { buildLocalizedMetadata, type SeoMessages } from '@/utils/seo';

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
  const messages = await getMessages(locale);
  return buildLocalizedMetadata({
    locale,
    messages: messages as SeoMessages,
    basePath: '',
    pageKey: 'home',
  });
}

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
      <Header currentLocale={locale} />
      <main className='pt-0 md:pt-8 pb-2 md:pb-0'>{children}</main>
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

import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

type SiteLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({
  children,
  params,
}: SiteLayoutProps) {
  const { locale } = await params;

  const messages = await import(`@/locales/${locale}.json`).then(
    m => m.default
  );

  return (
    <>
      <Header currentLocale={locale} />
      <main className='pt-0 md:pt-16 pb-2 md:pb-0'>
        <div suppressHydrationWarning>{children}</div>
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
          imprint: messages.footer.legal.imprint,
          cookies: messages.footer.legal.cookies,
        }}
        menuLabels={{
          home: messages.common.home,
          menu: messages.common.menu,
          info: messages.common.info,
        }}
      />
    </>
  );
}

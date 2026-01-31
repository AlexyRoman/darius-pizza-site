'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CookiesContent() {
  const t = useTranslations('legal.cookies');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href={`/${locale}`}
            className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4'
          >
            <ArrowLeft className='w-4 h-4' />
            {t('backToHome')}
          </Link>
          <h1 className='text-4xl font-bold text-foreground mb-2'>
            {t('title')}
          </h1>
          <p className='text-muted-foreground text-lg'>{t('lastUpdated')}</p>
        </div>

        {/* Content */}
        <div className='prose prose-lg max-w-none'>
          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('introduction.title')}
            </h2>
            <p className='mb-4'>{t('introduction.content')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('whatAreCookies.title')}
            </h2>
            <p className='mb-4'>{t('whatAreCookies.content')}</p>
            <p className='mb-4'>{t('whatAreCookies.types')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('howWeUseCookies.title')}
            </h2>
            <p className='mb-4'>{t('howWeUseCookies.content')}</p>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3'>
                {t('cookieTypes.necessary.title')}
              </h3>
              <p className='mb-2'>{t('cookieTypes.necessary.description')}</p>
              <p className='text-sm text-muted-foreground mb-4'>
                {t('cookieTypes.necessary.duration')}
              </p>
            </div>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3'>
                {t('cookieTypes.analytics.title')}
              </h3>
              <p className='mb-2'>{t('cookieTypes.analytics.description')}</p>
              <p className='text-sm text-muted-foreground mb-4'>
                {t('cookieTypes.analytics.duration')}
              </p>
            </div>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3'>
                {t('cookieTypes.functional.title')}
              </h3>
              <p className='mb-2'>{t('cookieTypes.functional.description')}</p>
              <p className='text-sm text-muted-foreground mb-4'>
                {t('cookieTypes.functional.duration')}
              </p>
            </div>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3'>
                {t('cookieTypes.marketing.title')}
              </h3>
              <p className='mb-2'>{t('cookieTypes.marketing.description')}</p>
              <p className='text-sm text-muted-foreground mb-4'>
                {t('cookieTypes.marketing.duration')}
              </p>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('thirdPartyCookies.title')}
            </h2>
            <p className='mb-4'>{t('thirdPartyCookies.content')}</p>
            <ul className='list-disc pl-6 mb-4'>
              <li>
                <strong>Google Analytics</strong>:{' '}
                {t('thirdPartyCookies.googleAnalytics')}
              </li>
              <li>
                <strong>Google Maps</strong>:{' '}
                {t('thirdPartyCookies.googleMaps')}
              </li>
              <li>
                <strong>Social Media</strong>:{' '}
                {t('thirdPartyCookies.socialMedia')}
              </li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('managingCookies.title')}
            </h2>
            <p className='mb-4'>{t('managingCookies.content')}</p>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3'>
                {t('managingCookies.browser.title')}
              </h3>
              <p className='mb-2'>{t('managingCookies.browser.content')}</p>
              <ul className='list-disc pl-6 mb-4'>
                <li>{t('managingCookies.browser.chrome')}</li>
                <li>{t('managingCookies.browser.firefox')}</li>
                <li>{t('managingCookies.browser.safari')}</li>
                <li>{t('managingCookies.browser.edge')}</li>
              </ul>
            </div>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3'>
                {t('managingCookies.website.title')}
              </h3>
              <p className='mb-2'>{t('managingCookies.website.content')}</p>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('consequences.title')}
            </h2>
            <p className='mb-4'>{t('consequences.content')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('updates.title')}
            </h2>
            <p className='mb-4'>{t('updates.content')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('contact.title')}
            </h2>
            <p className='mb-4'>{t('contact.content')}</p>
            <div className='bg-muted p-4 rounded-lg'>
              <p>
                <strong>{t('contact.email')}</strong>: contact@dariuspizza.com
              </p>
              <p>
                <strong>{t('contact.phone')}</strong>: 04.94.64.05.11
              </p>
              <p>
                <strong>{t('contact.address')}</strong>: 275 Avenue des Alliés,
                83240 Cavalaire
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

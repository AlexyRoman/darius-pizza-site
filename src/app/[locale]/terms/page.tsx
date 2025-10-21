'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const t = useTranslations('legal.terms');

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/'
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
              {t('acceptance.title')}
            </h2>
            <p className='mb-4'>{t('acceptance.content')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>{t('orders.title')}</h2>
            <p className='mb-4'>{t('orders.content')}</p>
            <ul className='list-disc pl-6 mb-4'>
              <li>{t('orders.accuracy')}</li>
              <li>{t('orders.pricing')}</li>
              <li>{t('orders.availability')}</li>
              <li>{t('orders.modifications')}</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('payment.title')}
            </h2>
            <p className='mb-4'>{t('payment.content')}</p>
            <ul className='list-disc pl-6 mb-4'>
              <li>{t('payment.methods')}</li>
              <li>{t('payment.timing')}</li>
              <li>{t('payment.refunds')}</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('delivery.title')}
            </h2>
            <p className='mb-4'>{t('delivery.content')}</p>
            <ul className='list-disc pl-6 mb-4'>
              <li>{t('delivery.times')}</li>
              <li>{t('delivery.areas')}</li>
              <li>{t('delivery.responsibility')}</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('liability.title')}
            </h2>
            <p className='mb-4'>{t('liability.content')}</p>
            <p className='mb-4'>{t('liability.limitation')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('intellectualProperty.title')}
            </h2>
            <p className='mb-4'>{t('intellectualProperty.content')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('prohibited.title')}
            </h2>
            <p className='mb-4'>{t('prohibited.content')}</p>
            <ul className='list-disc pl-6 mb-4'>
              <li>{t('prohibited.illegal')}</li>
              <li>{t('prohibited.harassment')}</li>
              <li>{t('prohibited.fraud')}</li>
              <li>{t('prohibited.violation')}</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('termination.title')}
            </h2>
            <p className='mb-4'>{t('termination.content')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('governingLaw.title')}
            </h2>
            <p className='mb-4'>{t('governingLaw.content')}</p>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('contact.title')}
            </h2>
            <p className='mb-4'>{t('contact.content')}</p>
            <div className='bg-muted p-4 rounded-lg'>
              <p>
                <strong>{t('contact.email')}</strong>: legal@dariuspizza.com
              </p>
              <p>
                <strong>{t('contact.phone')}</strong>: (123) 456-7890
              </p>
              <p>
                <strong>{t('contact.address')}</strong>: 123 Main Street,
                Downtown District, City, State 12345
              </p>
            </div>
          </section>

          <section className='mb-8'>
            <h2 className='text-2xl font-semibold mb-4'>
              {t('changes.title')}
            </h2>
            <p className='mb-4'>{t('changes.content')}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

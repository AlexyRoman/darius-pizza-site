'use client';

import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  FileText,
  CreditCard,
  Gift,
  Euro,
} from 'lucide-react';
import Link from 'next/link';

export default function LegalMentionsPage() {
  const t = useTranslations('legal.legalMentions');

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
        <div className='space-y-8'>
          {/* Company Identification */}
          <section className='bg-card rounded-lg p-6 border'>
            <div className='flex items-center gap-3 mb-4'>
              <Building className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-semibold'>
                {t('identification.title')}
              </h2>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-3'>
                <div>
                  <h3 className='font-medium text-foreground mb-1'>
                    {t('identification.companyName')}
                  </h3>
                  <p className='text-muted-foreground'>
                    {t('identification.companyNameValue')}
                  </p>
                </div>
                <div>
                  <h3 className='font-medium text-foreground mb-1'>
                    {t('identification.rcs')}
                  </h3>
                  <p className='text-muted-foreground'>
                    {t('identification.rcsValue')}
                  </p>
                </div>
                <div>
                  <h3 className='font-medium text-foreground mb-1'>
                    {t('identification.vatNumber')}
                  </h3>
                  <p className='text-muted-foreground'>
                    {t('identification.vatNumberValue')}
                  </p>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Mail className='w-4 h-4 text-muted-foreground' />
                  <div>
                    <h3 className='font-medium text-foreground mb-1'>
                      {t('identification.email')}
                    </h3>
                    <p className='text-muted-foreground'>
                      {t('identification.emailValue')}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='w-4 h-4 text-muted-foreground' />
                  <div>
                    <h3 className='font-medium text-foreground mb-1'>
                      {t('identification.phone')}
                    </h3>
                    <p className='text-muted-foreground'>
                      {t('identification.phoneValue')}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className='font-medium text-foreground mb-1'>
                    {t('identification.hosting')}
                  </h3>
                  <p className='text-muted-foreground'>
                    {t('identification.hostingValue')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Terms of Sale */}
          <section className='bg-card rounded-lg p-6 border'>
            <div className='flex items-center gap-3 mb-4'>
              <FileText className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-semibold'>
                {t('termsOfSale.title')}
              </h2>
            </div>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <Euro className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                <div>
                  <h3 className='font-medium text-foreground mb-1'>
                    {t('termsOfSale.pricing.title')}
                  </h3>
                  <p className='text-muted-foreground'>
                    {t('termsOfSale.pricing.content')}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <Gift className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                <div>
                  <h3 className='font-medium text-foreground mb-1'>
                    {t('termsOfSale.loyaltyProgram.title')}
                  </h3>
                  <p className='text-muted-foreground'>
                    {t('termsOfSale.loyaltyProgram.content')}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <CreditCard className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                <div>
                  <h3 className='font-medium text-foreground mb-1'>
                    {t('termsOfSale.payment.title')}
                  </h3>
                  <p className='text-muted-foreground'>
                    {t('termsOfSale.payment.content')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section className='bg-muted/50 rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4'>
              {t('additionalInfo.title')}
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              {t('additionalInfo.content')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import {
  ArrowLeft,
  Shield,
  FileText,
  Database,
  Users,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy');

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
          {/* Preamble */}
          <section className='bg-card rounded-lg p-6 border'>
            <div className='flex items-center gap-3 mb-4'>
              <FileText className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-semibold'>{t('preamble.title')}</h2>
            </div>
            <div className='space-y-4'>
              <p className='text-muted-foreground leading-relaxed'>
                {t('preamble.content')}
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                {t('preamble.rights')}
              </p>
              <div>
                <p className='text-muted-foreground mb-2'>
                  {t('preamble.relatedDocuments')}
                </p>
                <div className='space-y-2'>
                  <Link
                    href='/legal-mentions'
                    className='flex items-center gap-2 text-primary hover:underline'
                  >
                    <ExternalLink className='w-4 h-4' />
                    {t('preamble.legalMentionsLink')}
                  </Link>
                  <Link
                    href='/cookies'
                    className='flex items-center gap-2 text-primary hover:underline'
                  >
                    <ExternalLink className='w-4 h-4' />
                    {t('preamble.cookiesPolicyLink')}
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Principles */}
          <section className='bg-card rounded-lg p-6 border'>
            <div className='flex items-center gap-3 mb-4'>
              <Shield className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-semibold'>
                {t('principles.title')}
              </h2>
            </div>
            <div className='space-y-4'>
              <p className='text-muted-foreground leading-relaxed'>
                {t('principles.content')}
              </p>
              <ul className='space-y-2'>
                {t
                  .raw('principles.principles')
                  .map((principle: string, index: number) => (
                    <li key={index} className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                      <span className='text-muted-foreground'>{principle}</span>
                    </li>
                  ))}
              </ul>
              <div className='mt-6'>
                <p className='font-medium text-foreground mb-3'>
                  {t('principles.legalBasis')}
                </p>
                <ul className='space-y-2'>
                  {t
                    .raw('principles.legalBasisList')
                    .map((basis: string, index: number) => (
                      <li key={index} className='flex items-start gap-3'>
                        <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                        <span className='text-muted-foreground'>{basis}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Data Collection */}
          <section className='bg-card rounded-lg p-6 border'>
            <div className='flex items-center gap-3 mb-4'>
              <Database className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-semibold'>
                {t('dataCollection.title')}
              </h2>
            </div>
            <div className='space-y-6'>
              {/* Collected Data */}
              <div>
                <h3 className='text-xl font-semibold mb-3'>
                  {t('dataCollection.collectedData.title')}
                </h3>
                <p className='text-muted-foreground mb-3'>
                  {t('dataCollection.collectedData.content')}
                </p>
                <ul className='space-y-2 mb-3'>
                  {t
                    .raw('dataCollection.collectedData.dataTypes')
                    .map((dataType: string, index: number) => (
                      <li key={index} className='flex items-start gap-3'>
                        <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                        <span className='text-muted-foreground'>
                          {dataType}
                        </span>
                      </li>
                    ))}
                </ul>
                <p className='text-muted-foreground'>
                  {t('dataCollection.collectedData.purpose')}
                </p>
              </div>

              {/* Collection Method */}
              <div>
                <h3 className='text-xl font-semibold mb-3'>
                  {t('dataCollection.collectionMethod.title')}
                </h3>
                <p className='text-muted-foreground mb-3'>
                  {t('dataCollection.collectionMethod.automaticCollection')}
                </p>
                <p className='text-muted-foreground mb-3'>
                  {t('dataCollection.collectionMethod.cookieAcceptance')}
                </p>
                <p className='text-muted-foreground mb-3'>
                  {t('dataCollection.collectionMethod.googleAnalytics')}
                </p>
                <p className='text-muted-foreground mb-3'>
                  {t('dataCollection.collectionMethod.retention')}
                </p>
                <p className='text-muted-foreground'>
                  {t('dataCollection.collectionMethod.legalRetention')}
                </p>
              </div>

              {/* Hosting */}
              <div>
                <h3 className='text-xl font-semibold mb-3'>
                  {t('dataCollection.hosting.title')}
                </h3>
                <p className='text-muted-foreground mb-2'>
                  {t('dataCollection.hosting.content')}
                </p>
                <p className='text-muted-foreground'>
                  {t('dataCollection.hosting.hostingProvider')}
                </p>
              </div>

              {/* Data Sharing */}
              <div>
                <h3 className='text-xl font-semibold mb-3'>
                  {t('dataCollection.dataSharing.title')}
                </h3>
                <p className='text-muted-foreground'>
                  {t('dataCollection.dataSharing.content')}
                </p>
              </div>

              {/* Cookies */}
              <div>
                <h3 className='text-xl font-semibold mb-3'>
                  {t('dataCollection.cookies.title')}
                </h3>
                <p className='text-muted-foreground mb-3'>
                  {t('dataCollection.cookies.content')}
                </p>
                <p className='text-muted-foreground'>
                  {t('dataCollection.cookies.detailedInfo')}
                </p>
              </div>
            </div>
          </section>

          {/* Data Controller */}
          <section className='bg-card rounded-lg p-6 border'>
            <div className='flex items-center gap-3 mb-4'>
              <Users className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-semibold'>
                {t('dataController.title')}
              </h2>
            </div>
            <div className='space-y-6'>
              {/* Controller */}
              <div>
                <h3 className='text-xl font-semibold mb-3'>
                  {t('dataController.controller.title')}
                </h3>
                <p className='text-muted-foreground mb-3'>
                  {t('dataController.controller.content')}
                </p>
                <p className='text-muted-foreground mb-2'>
                  {t('dataController.controller.contact')}
                </p>
                <p className='text-muted-foreground'>
                  {t('dataController.controller.email')}
                </p>
              </div>

              {/* DPO */}
              <div>
                <h3 className='text-xl font-semibold mb-3'>
                  {t('dataController.dpo.title')}
                </h3>
                <p className='text-muted-foreground mb-2'>
                  {t('dataController.dpo.content')}
                </p>
                <p className='text-muted-foreground mb-3'>
                  {t('dataController.dpo.dpoName')}
                </p>
                <p className='text-muted-foreground'>
                  {t('dataController.dpo.cnil')}
                </p>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className='bg-card rounded-lg p-6 border'>
            <div className='flex items-center gap-3 mb-4'>
              <Shield className='w-6 h-6 text-primary' />
              <h2 className='text-2xl font-semibold'>
                {t('userRights.title')}
              </h2>
            </div>
            <div className='space-y-4'>
              <p className='text-muted-foreground leading-relaxed'>
                {t('userRights.content')}
              </p>
              <ul className='space-y-2'>
                {t
                  .raw('userRights.rights')
                  .map((right: string, index: number) => (
                    <li key={index} className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                      <span className='text-muted-foreground'>{right}</span>
                    </li>
                  ))}
              </ul>
              <div className='mt-6'>
                <h3 className='text-xl font-semibold mb-3'>
                  {t('userRights.exerciseRights.title')}
                </h3>
                <p className='text-muted-foreground mb-3'>
                  {t('userRights.exerciseRights.content')}
                </p>
                <p className='text-muted-foreground mb-3'>
                  {t('userRights.exerciseRights.requiredInfo')}
                </p>
                <p className='text-muted-foreground'>
                  {t('userRights.exerciseRights.cnilInfo')}
                </p>
              </div>
            </div>
          </section>

          {/* Business Context */}
          <section className='bg-muted/50 rounded-lg p-6'>
            <h2 className='text-xl font-semibold mb-4'>
              {t('businessContext.title')}
            </h2>
            <p className='text-muted-foreground leading-relaxed mb-4'>
              {t('businessContext.content')}
            </p>
            <div className='mb-4'>
              <h3 className='font-medium text-foreground mb-2'>
                Nos services :
              </h3>
              <ul className='space-y-2'>
                {t
                  .raw('businessContext.services')
                  .map((service: string, index: number) => (
                    <li key={index} className='flex items-start gap-3'>
                      <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></div>
                      <span className='text-muted-foreground'>{service}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <p className='text-muted-foreground leading-relaxed'>
              {t('businessContext.dataPurpose')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

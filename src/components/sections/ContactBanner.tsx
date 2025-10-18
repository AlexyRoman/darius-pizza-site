'use client';

import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function ContactBanner() {
  const t = useTranslations('info.contactBanner');
  const locale = useLocale();

  return (
    <section className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background-secondary to-background'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Contact Banner */}
          <Card className='bg-primary/5 border-primary/20 shadow-lg'>
            <CardContent className='p-8 text-center'>
              <div className='flex items-center justify-center gap-3 mb-4'>
                <Mail className='h-8 w-8 text-primary' />
                <h2 className='text-2xl sm:text-3xl font-primary font-bold text-foreground'>
                  {t('title')}
                </h2>
              </div>
              <p className='text-lg text-foreground-secondary mb-6 max-w-2xl mx-auto'>
                {t('description')}
              </p>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                {/* Email Button */}
                <a
                  href='mailto:info@dariuspizza.com'
                  className='inline-flex items-center gap-2 px-6 py-3 !bg-primary !text-primary-foreground rounded-lg font-medium hover:!bg-primary active:!bg-primary focus:!bg-primary transition-colors shadow-lg md:hover:shadow-xl'
                >
                  <Mail className='h-5 w-5' />
                  {t('emailButton')}
                </a>

                {/* Contact Form Button */}
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='px-6 py-3 border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300'
                >
                  <Link
                    href={`/${locale}/info#contact-form`}
                    className='flex items-center gap-2'
                  >
                    {t('formButton')}
                    <ArrowRight className='h-5 w-5' />
                  </Link>
                </Button>
              </div>

              {/* Quick Info */}
              <div className='mt-6 pt-6 border-t border-border/30'>
                <p className='text-sm text-foreground-secondary'>
                  {t('quickInfo')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

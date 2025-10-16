'use client';

import * as React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type FooterLeftProps = {
  className?: string;
  subtitle?: string;
};

export function FooterLeft(props: FooterLeftProps) {
  const { className, subtitle } = props;
  const tSeo = useTranslations('seo');
  const siteName = tSeo('siteName', { fallback: 'Alexy Roman' });

  return (
    <div className={className}>
      <div className='flex flex-col items-center md:items-start gap-2'>
        <div className='flex items-center gap-3'>
          <Image
            src='/icon.png'
            alt={`${siteName} logo`}
            width={36}
            height={36}
            className='rounded-md select-none'
            priority
          />
          <div className='text-3xl md:text-4xl font-extrabold tracking-tight'>
            {siteName}
          </div>
        </div>
        {subtitle ? (
          <p className='text-sm text-muted-foreground text-center md:text-left max-w-[32ch]'>
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default FooterLeft;

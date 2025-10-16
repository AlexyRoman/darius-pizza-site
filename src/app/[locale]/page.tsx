"use client";

import { useTranslations } from 'next-intl';
import LocaleToggle from '@/components/header/LocaleToggle';
import ThemeToggle from '@/components/header/ThemeToggle';

export default function Home() {
  const t = useTranslations('common');
  return (
    <div className='p-8'>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='text-2xl font-semibold'>Darius Pizza</h1>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <LocaleToggle currentLocale='fr' />
        </div>
      </div>
      <p className='text-muted-foreground mt-2'>{t('welcome')}</p>
    </div>
  );
}



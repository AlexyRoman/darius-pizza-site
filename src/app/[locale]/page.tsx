'use client';

import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('common');
  return (
    <section className='relative overflow-hidden'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
        <div className='mx-auto max-w-3xl text-center'>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
            Alexy Roman
          </h1>
          <p className='mt-4 text-lg text-muted-foreground'>{t('welcome')}</p>
          <div className='mt-8 flex items-center justify-center gap-3'>
            <a
              className='inline-flex h-10 items-center rounded-md bg-foreground px-6 text-sm font-medium text-background shadow transition-colors hover:opacity-90'
              href='#'
            >
              Get Started
            </a>
            <a
              className='inline-flex h-10 items-center rounded-md border px-6 text-sm font-medium shadow-sm hover:bg-accent'
              href='#'
            >
              Learn More
            </a>
          </div>
        </div>
        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[1, 2, 3].map(i => (
            <div key={i} className='rounded-lg border p-6 bg-card'>
              <div className='h-10 w-10 rounded bg-foreground/10 mb-4' />
              <h3 className='font-semibold mb-1'>Feature {i}</h3>
              <p className='text-sm text-muted-foreground'>
                Beautiful, accessible and responsive UI ready to customize.
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className='pointer-events-none absolute inset-0 -z-10 opacity-10 [background:radial-gradient(600px_circle_at_50%_0%,theme(colors.primary.DEFAULT)/40%,transparent_60%)]' />
    </section>
  );
}

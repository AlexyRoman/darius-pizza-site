'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Pizza } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background-secondary to-background'>
      {/* Background Effects */}
      <div className='absolute inset-0 -z-10'>
        {/* Gradient overlays */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80' />

        {/* Animated shapes */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse' />
        <div className='absolute top-40 right-20 w-24 h-24 bg-accent/15 rounded-full blur-lg animate-pulse delay-1000' />
        <div className='absolute bottom-20 left-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-2000' />

        {/* Grid pattern */}
        <div className='absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.foreground.DEFAULT)_1px,transparent_0)] [background-size:20px_20px]' />
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <div className='max-w-2xl mx-auto space-y-8'>
          {/* Pizza Icon */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-2xl' />
              <div className='relative bg-background-elevated rounded-full p-8 shadow-2xl border border-border/50'>
                <Pizza className='w-16 h-16 text-primary animate-bounce' />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className='space-y-4'>
            <h1 className='text-6xl sm:text-7xl lg:text-8xl font-primary font-bold text-primary'>
              404
            </h1>
            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-primary font-semibold text-foreground'>
              {t('title')}
            </h2>
            <p className='text-lg sm:text-xl text-foreground-secondary font-secondary leading-relaxed max-w-xl mx-auto'>
              {t('message')}
            </p>
          </div>

          {/* CTA Button */}
          <div className='pt-8'>
            <Button
              asChild
              size='lg'
              className='h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group'
            >
              <Link href='/' className='flex items-center gap-2'>
                <Home className='w-5 h-5 group-hover:scale-110 transition-transform' />
                {t('backHome')}
              </Link>
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className='flex justify-center space-x-4 pt-8'>
            <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
            <div className='w-2 h-2 bg-accent rounded-full animate-pulse delay-300' />
            <div className='w-2 h-2 bg-secondary rounded-full animate-pulse delay-700' />
          </div>
        </div>
      </div>
    </div>
  );
}

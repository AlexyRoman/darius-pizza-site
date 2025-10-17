'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import hoursConfig from '@/config/restaurant/hours.json';
import closingsConfig from '@/config/restaurant/closings.json';

interface OpeningHours {
  [key: string]: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  };
}

interface Closing {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  isActive: boolean;
}

export default function HeroSection() {
  const t = useTranslations('hero');
  const hours = hoursConfig.openingHours as OpeningHours;
  const closings = closingsConfig.scheduledClosings as Closing[];

  // State to track if component is mounted (client-side)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Get current day and time (only on client-side to avoid hydration mismatch)
  const now = isMounted ? new Date() : new Date('2024-01-01'); // Fallback date for SSR
  const currentDayName = isMounted
    ? now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    : 'monday';
  const currentTime = isMounted ? now.toTimeString().slice(0, 5) : '00:00'; // HH:MM format

  // Check if restaurant is currently open
  const todayHours =
    hours[
      Object.keys(hours).find(key => key.toLowerCase() === currentDayName) ||
        'monday'
    ];

  const isCurrentlyOpen =
    todayHours &&
    currentTime >= todayHours.open &&
    currentTime <= todayHours.close &&
    todayHours.isOpen;

  // Check if restaurant is opening soon (within 1 hour)
  const isOpeningSoon =
    todayHours &&
    !isCurrentlyOpen &&
    todayHours.isOpen &&
    currentTime < todayHours.open;

  // Calculate minutes until opening
  const getMinutesUntilOpening = () => {
    if (!todayHours || !isOpeningSoon) return 0;

    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const [openHour, openMinute] = todayHours.open.split(':').map(Number);

    const currentMinutes = currentHour * 60 + currentMinute;
    const openMinutes = openHour * 60 + openMinute;

    return openMinutes - currentMinutes;
  };

  const minutesUntilOpening = getMinutesUntilOpening();

  // Check for current closing (happening right now)
  const currentClosing = closings
    .filter(closing => closing.isActive)
    .find(closing => {
      if (closing.startDate && closing.endDate) {
        const startDate = new Date(closing.startDate);
        const endDate = new Date(closing.endDate);
        return now >= startDate && now <= endDate;
      }
      return false;
    });

  // Get badge content and styling
  const getBadgeContent = () => {
    if (currentClosing) {
      return {
        text: t('badge.currentlyClosed'),
        className: 'bg-destructive text-destructive-foreground',
        icon: <div className='w-2 h-2 rounded-full bg-current' />,
      };
    }

    if (isCurrentlyOpen) {
      return {
        text: t('badge.openNow'),
        className: 'bg-success text-success-foreground',
        icon: <div className='w-2 h-2 rounded-full bg-current' />,
      };
    }

    if (isOpeningSoon && minutesUntilOpening <= 60) {
      return {
        text: t('badge.openingIn', {
          minutes: minutesUntilOpening,
          plural: minutesUntilOpening === 1 ? '' : 's',
        }),
        className: 'bg-orange-500 text-white border-orange-500',
        icon: <div className='w-2 h-2 rounded-full bg-current' />,
      };
    }

    return {
      text: t('badge.closed'),
      className: 'bg-secondary text-secondary-foreground',
      icon: <div className='w-2 h-2 rounded-full bg-current' />,
    };
  };

  const badgeContent = getBadgeContent();
  return (
    <section className='relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background via-background-secondary to-background-secondary'>
      {/* Background Effects */}
      <div className='absolute inset-0 -z-10'>
        {/* Smooth transition from header */}
        <div className='absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/80 via-background/40 to-transparent' />

        {/* Gradient overlays */}
        <div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80' />

        {/* Animated shapes */}
        <div className='absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse' />
        <div className='absolute top-40 right-20 w-24 h-24 bg-accent/15 rounded-full blur-lg animate-pulse delay-1000' />
        <div className='absolute bottom-20 left-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-2000' />

        {/* Grid pattern */}
        <div className='absolute inset-0 opacity-[0.02] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.foreground.DEFAULT)_1px,transparent_0)] [background-size:20px_20px]' />

        {/* Subtle texture overlay for consistency */}
        <div className='absolute inset-0 bg-gradient-to-b from-background/95 via-background to-background/95' />
      </div>

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16'>
        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Content Section */}
          <div className='space-y-8 text-center lg:text-left'>
            {/* Badge */}
            <Badge
              variant={
                currentClosing
                  ? 'destructive'
                  : isCurrentlyOpen
                    ? 'default'
                    : isOpeningSoon && minutesUntilOpening <= 60
                      ? 'outline'
                      : 'secondary'
              }
              className={`${badgeContent.className}`}
            >
              {badgeContent.icon}
              {badgeContent.text}
            </Badge>

            {/* Main Heading */}
            <div className='space-y-4'>
              <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-primary font-bold tracking-tight text-foreground leading-tight'>
                {t('heading.tasteThe')}{' '}
                <span className='relative'>
                  <span className='relative z-10'>
                    {t('heading.authentic')}
                  </span>
                  <div className='absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full -z-10' />
                </span>
                <br />
                {t('heading.italianPizza')}
              </h1>
              <p className='text-lg sm:text-xl text-foreground-secondary font-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0'>
                {t('description')}
              </p>
            </div>

            {/* Features */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
              <div className='flex items-center gap-2 text-foreground-secondary'>
                <Clock className='w-4 h-4 text-primary' />
                <span>{t('features.freshDaily')}</span>
              </div>
              <div className='flex items-center gap-2 text-foreground-secondary'>
                <MapPin className='w-4 h-4 text-primary' />
                <span>{t('features.localIngredients')}</span>
              </div>
              <div className='flex items-center gap-2 text-foreground-secondary'>
                <Star className='w-4 h-4 text-primary' />
                <span>{t('features.fiveStarRated')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
              <Button
                asChild
                size='lg'
                className='h-14 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group'
              >
                <Link href='/menu' className='flex items-center gap-2'>
                  {t('cta.viewMenu')}
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                size='lg'
                className='h-14 px-8 text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300'
              >
                <Link
                  href='tel:+1234567890'
                  className='flex items-center gap-2'
                >
                  {t('cta.orderNow')}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-8 pt-8 border-t border-border/50'>
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-primary font-primary'>
                  15+
                </div>
                <div className='text-sm text-foreground-secondary'>
                  Years Experience
                </div>
              </div>
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-primary font-primary'>
                  50+
                </div>
                <div className='text-sm text-foreground-secondary'>
                  Pizza Varieties
                </div>
              </div>
              <div className='text-center lg:text-left'>
                <div className='text-2xl font-bold text-primary font-primary'>
                  1000+
                </div>
                <div className='text-sm text-foreground-secondary'>
                  Happy Customers
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className='relative'>
            {/* Image Container with Effects */}
            <div className='relative mx-auto max-w-lg lg:max-w-none'>
              {/* Background decoration */}
              <div className='absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl' />
              <div className='absolute -inset-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl blur-xl' />

              {/* Main image */}
              <div className='relative bg-background-elevated rounded-2xl p-8 shadow-2xl border border-border/50'>
                <div className='relative aspect-square rounded-xl overflow-hidden'>
                  <Image
                    src='/pizza-hero.webp'
                    alt='Authentic Italian Pizza'
                    fill
                    className='object-contain hover:scale-105 transition-transform duration-500 rounded-xl'
                    priority
                  />
                  {/* Stronger vignette for soft edges */}
                  <div className='absolute inset-0 rounded-xl pointer-events-none opacity-80 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_62%,rgba(0,0,0,0.12)_100%)]' />
                  {/* Subtle border glow to blend with card */}
                  <div className='absolute inset-0 rounded-xl pointer-events-none bg-gradient-to-b from-transparent via-transparent to-background/40' />

                  {/* Floating elements */}
                  <div className='absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg'>
                    {t('stickers.freshDaily')}
                  </div>
                  <div className='absolute bottom-4 left-4 bg-accent text-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg'>
                    {t('stickers.handmade')}
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className='absolute -top-4 -left-4 bg-background-elevated rounded-xl p-4 shadow-lg border border-border/50 animate-bounce'>
                <div className='flex items-center gap-2'>
                  <Star className='w-4 h-4 text-primary fill-primary' />
                  <span className='text-sm font-semibold text-foreground'>
                    4.8/5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-secondary to-transparent pointer-events-none' />
    </section>
  );
}

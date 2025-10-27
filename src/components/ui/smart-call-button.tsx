'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getSitePhone } from '@/config/site';
import { isTimeInPeriods } from '@/lib/opening-hours-utils';
import hoursConfig from '@/config/restaurant/hours.json';

interface OpeningHours {
  [key: string]: {
    day: string;
    periods: { open: string; close: string }[];
    isOpen: boolean;
  };
}

interface SmartCallButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  asChild?: boolean;
  'aria-label'?: string;
}

export function SmartCallButton({
  children,
  className,
  size = 'default',
  variant = 'default',
  asChild = false,
  'aria-label': ariaLabel,
  ...props
}: SmartCallButtonProps) {
  const t = useTranslations('callDialog');
  const [isMounted, setIsMounted] = useState(false);
  const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);
  const [isOpeningSoon, setIsOpeningSoon] = useState(false);

  const hours = hoursConfig.openingHours as OpeningHours;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const now = new Date();
    const currentDayName = now
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const todayHours =
      hours[
        Object.keys(hours).find(key => key.toLowerCase() === currentDayName) ||
          'monday'
      ];

    if (todayHours && todayHours.isOpen) {
      // Check if currently open
      const currentlyOpen = isTimeInPeriods(currentTime, todayHours.periods);
      setIsCurrentlyOpen(currentlyOpen);

      // Check if opening soon (within 30 minutes)
      if (!currentlyOpen) {
        const currentMinutes =
          parseInt(currentTime.split(':')[0]) * 60 +
          parseInt(currentTime.split(':')[1]);
        const thirtyMinutesFromNow = currentMinutes + 30;

        const openingSoon = todayHours.periods.some(period => {
          const [openHour, openMinute] = period.open.split(':').map(Number);
          const openMinutes = openHour * 60 + openMinute;
          return (
            openMinutes > currentMinutes && openMinutes <= thirtyMinutesFromNow
          );
        });

        setIsOpeningSoon(openingSoon);
      } else {
        setIsOpeningSoon(false);
      }
    } else {
      setIsCurrentlyOpen(false);
      setIsOpeningSoon(false);
    }
  }, [isMounted, hours]);

  const shouldShowAlert = !isCurrentlyOpen && !isOpeningSoon;

  const handleCall = () => {
    window.location.href = `tel:${getSitePhone()}`;
  };

  if (!isMounted) {
    // SSR fallback - show normal button
    return (
      <Button
        asChild={asChild}
        size={size}
        variant={variant}
        className={className}
        aria-label={ariaLabel}
        {...props}
      >
        <a href={`tel:${getSitePhone()}`} data-gtm-click='call_button'>
          {children}
        </a>
      </Button>
    );
  }

  if (shouldShowAlert) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size={size}
            variant={variant}
            className={className}
            aria-label={ariaLabel}
            {...props}
          >
            {children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className='bg-background border-border max-h-[90vh] overflow-y-auto'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-foreground text-center sm:text-left'>
              {t('title')}
            </AlertDialogTitle>
            <AlertDialogDescription className='text-muted-foreground text-center sm:text-left'>
              {t('description')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex-col sm:flex-row gap-2'>
            <AlertDialogCancel className='bg-background border-border text-foreground hover:bg-muted w-full sm:w-auto order-2 sm:order-1'>
              {t('callLater')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCall}
              className='bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2'
              data-gtm-click='call_button'
            >
              {t('callNow')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Normal call button when open or opening soon
  return (
    <Button
      asChild={asChild}
      size={size}
      variant={variant}
      className={className}
      aria-label={ariaLabel}
      {...props}
    >
      <a href={`tel:${getSitePhone()}`} data-gtm-click='call_button'>
        {children}
      </a>
    </Button>
  );
}

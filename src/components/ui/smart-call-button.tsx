'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    // Close the dialog first to avoid janky lingering UI on mobile
    setIsDialogOpen(false);
    // Ensure no element retains focus that could cause iOS to scroll
    if (typeof document !== 'undefined') {
      const active = document.activeElement as HTMLElement | null;
      if (active && typeof active.blur === 'function') active.blur();
    }
    // Navigate to phone dialer after state flush
    setTimeout(() => {
      window.location.href = `tel:${getSitePhone()}`;
    }, 0);
  };

  if (!isMounted) {
    // SSR fallback - show normal button
    return (
      <Button
        /* Avoid tel: links before hydration to prevent mobile call prompt */
        size={size}
        variant={variant}
        className={className}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Button>
    );
  }

  if (shouldShowAlert) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button
          type='button'
          size={size}
          variant={variant}
          className={className}
          aria-label={ariaLabel}
          onMouseDown={e => e.preventDefault()}
          onTouchStart={e => e.preventDefault()}
          onClick={() => setIsDialogOpen(true)}
          {...props}
        >
          {children}
        </Button>
        <DialogContent
          className='bg-background border-border max-h-[90vh] overflow-y-auto data-[state=open]:animate-none data-[state=closed]:animate-none motion-reduce:animate-none'
          onOpenAutoFocus={e => e.preventDefault()}
          onCloseAutoFocus={e => {
            e.preventDefault();
            if (typeof document !== 'undefined') {
              const active = document.activeElement as HTMLElement | null;
              if (active && typeof active.blur === 'function') active.blur();
            }
          }}
          onEscapeKeyDown={e => {
            e.preventDefault();
            setIsDialogOpen(false);
          }}
          onPointerDownOutside={e => {
            // Prevent any propagation to elements beneath on iPhone
            e.preventDefault();
            e.stopPropagation();
            setIsDialogOpen(false);
            if (typeof document !== 'undefined') {
              const active = document.activeElement as HTMLElement | null;
              if (active && typeof active.blur === 'function') active.blur();
            }
          }}
          onInteractOutside={e => {
            e.preventDefault();
            e.stopPropagation();
            setIsDialogOpen(false);
            if (typeof document !== 'undefined') {
              const active = document.activeElement as HTMLElement | null;
              if (active && typeof active.blur === 'function') active.blur();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className='text-foreground text-center sm:text-left'>
              {t('title')}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground text-center sm:text-left'>
              {t('description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex-col sm:flex-row gap-3 mt-4 sm:mt-6'>
            <Button
              type='button'
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsDialogOpen(false);
                if (typeof document !== 'undefined') {
                  const active = document.activeElement as HTMLElement | null;
                  if (active && typeof active.blur === 'function')
                    active.blur();
                }
              }}
              variant='outline'
              className='w-full sm:w-auto order-2 sm:order-1'
            >
              {t('callLater')}
            </Button>
            <Button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleCall();
              }}
              className='bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2'
              data-gtm-click='call_button'
            >
              {t('callNow')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Normal call button when open or opening soon
  return (
    <Button
      type='button'
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

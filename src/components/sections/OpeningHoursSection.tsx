'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import {
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRestaurantConfig } from '@/hooks/useRestaurantConfig';
import hoursConfig from '@/content/restaurant/hours.json';
import { formatDate, formatDateTime } from '@/utils/date-utils';
import { formatNextOpeningTime } from '@/utils/opening-hours-utils';
import { SmartCallButton } from '@/components/ui/smart-call-button';
import {
  computeIsCurrentlyOpen,
  computeIsOpeningSoon,
  formatTimeForLocale,
  getActiveMessages,
  getCurrentPeriodInfo,
  getMinutesUntilOpening,
  getTodayHours,
  getUpcomingClosings,
} from '@/lib/opening-hours-view';
import type { OpeningHours } from '@/types/opening-hours';

type SpecialMessage = {
  id?: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | string;
  isActive: boolean;
  startDate: string;
  endDate?: string | null;
  priority: number;
};

type ScheduledClosing = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  date?: string | null;
  startDate?: string;
  endDate?: string;
};

export default function OpeningHoursSection() {
  const t = useTranslations('hours');
  const tHero = useTranslations('hero');
  const locale = useLocale();

  // Load restaurant configurations with locale support (except hours which uses original system)
  const { data: messagesConfig } = useRestaurantConfig('messages', locale);
  const { data: closingsConfig } = useRestaurantConfig('closings', locale);
  const { data: contactConfig } = useRestaurantConfig('contact', locale);

  // Hours use the original system (not localized)
  const hours = hoursConfig.openingHours as OpeningHours;
  const messages = (messagesConfig?.specialMessages || []) as SpecialMessage[];
  const closings = (closingsConfig?.scheduledClosings ||
    []) as ScheduledClosing[];
  const contact = contactConfig?.contact;

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
  const todayHours = getTodayHours(hours, currentDayName);
  const isCurrentlyOpen = computeIsCurrentlyOpen(todayHours, currentTime);

  // Check if restaurant is opening soon (within 1 hour)
  const isOpeningSoon =
    !isCurrentlyOpen && computeIsOpeningSoon(todayHours, currentTime, 60);

  // Calculate minutes until opening
  const minutesUntilOpening = isOpeningSoon
    ? getMinutesUntilOpening(todayHours, currentTime)
    : 0;

  // Helper function to get current period info
  const periodInfo = getCurrentPeriodInfo(todayHours, currentTime);

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

  // Get active messages sorted by priority
  const activeMessages = getActiveMessages<SpecialMessage>(messages, now);

  // Get upcoming closings (future only, not current)
  const upcomingClosings = getUpcomingClosings<ScheduledClosing>(
    closings,
    now,
    3
  );

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-4 w-4' />;
      case 'warning':
        return <AlertCircle className='h-4 w-4' />;
      case 'error':
        return <XCircle className='h-4 w-4' />;
      default:
        return <Info className='h-4 w-4' />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatTime = (time: string) => formatTimeForLocale(time, locale);

  // Helper function to format dates consistently (avoiding hydration mismatch)
  const formatDateLocal = (
    dateString: string,
    options: Intl.DateTimeFormatOptions = {}
  ) => {
    if (!isMounted) {
      // Return a placeholder during SSR to avoid hydration mismatch
      return 'Loading...';
    }
    return formatDate(dateString, locale, options);
  };

  const formatDateTimeLocal = (
    dateString: string,
    options: Intl.DateTimeFormatOptions = {}
  ) => {
    if (!isMounted) {
      return 'Loading...';
    }
    return formatDateTime(dateString, locale, options);
  };

  return (
    <section className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background-secondary to-background'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-12'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-primary font-bold text-foreground mb-4'>
              {t('visitTitle')}
            </h2>
            <p className='text-lg text-foreground-secondary font-secondary max-w-2xl mx-auto'>
              {t('visitSubtitle')}
            </p>
          </div>

          {/* Current Closing Banner - Full Width */}
          {currentClosing && (
            <div className='mb-12'>
              <Alert
                variant='destructive'
                className='bg-destructive/10 border-destructive/20 text-destructive'
              >
                <AlertTitle className='text-xl font-bold text-destructive'>
                  {currentClosing.title}
                </AlertTitle>
                <AlertDescription className='text-base text-destructive/90 leading-relaxed'>
                  {currentClosing.description}
                </AlertDescription>
                {currentClosing.startDate && currentClosing.endDate && (
                  <div className='col-start-2 text-sm text-destructive/80 font-medium'>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      <span>
                        {t('currentClosing.closedFromUntil', {
                          from: formatDateTimeLocal(currentClosing.startDate),
                          until: formatDateTimeLocal(currentClosing.endDate),
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </Alert>
            </div>
          )}

          <div className='grid lg:grid-cols-2 gap-8 lg:gap-12'>
            {/* Opening Hours Card */}
            <Card className='bg-background-elevated border-border/50 shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-3 text-2xl font-primary font-semibold text-foreground'>
                  <Clock className='h-6 w-6 text-primary' />
                  {t('card.openingHours')}
                </CardTitle>
                <div className='flex items-center gap-2 mt-2'>
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
                    className={`${
                      currentClosing
                        ? 'bg-destructive text-destructive-foreground'
                        : isCurrentlyOpen
                          ? 'bg-success text-success-foreground'
                          : isOpeningSoon && minutesUntilOpening <= 60
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-secondary text-secondary-foreground'
                    } ${
                      !currentClosing &&
                      !isCurrentlyOpen &&
                      !(isOpeningSoon && minutesUntilOpening <= 60)
                        ? 'py-2 px-3 h-auto'
                        : ''
                    }`}
                  >
                    {currentClosing ? (
                      t('badge.currentlyClosed')
                    ) : isCurrentlyOpen ? (
                      tHero('badge.openNow')
                    ) : isOpeningSoon && minutesUntilOpening <= 60 ? (
                      tHero('badge.openingIn', {
                        minutes: minutesUntilOpening,
                        plural: minutesUntilOpening === 1 ? '' : 's',
                      })
                    ) : (
                      <div className='flex items-center gap-2 text-left'>
                        <div className='flex-shrink-0'>
                          <div className='w-2 h-2 rounded-full bg-current' />
                        </div>
                        <div className='flex flex-col'>
                          <div className='text-xs font-medium'>
                            {t('badge.closed')}
                          </div>
                          <div className='text-xs opacity-90'>
                            {formatNextOpeningTime(now, t)}
                          </div>
                        </div>
                      </div>
                    )}
                  </Badge>
                  <span className='text-sm text-foreground-secondary'>
                    {currentClosing
                      ? t('badge.temporarilyClosedNote')
                      : isCurrentlyOpen && periodInfo?.currentPeriod
                        ? t('badge.openUntil', {
                            time: formatTime(periodInfo.currentPeriod.close),
                          })
                        : isOpeningSoon && periodInfo?.nextOpeningPeriod
                          ? t('badge.openingAt', {
                              time: formatTime(
                                periodInfo.nextOpeningPeriod.open
                              ),
                            })
                          : t('badge.checkHoursBelow')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className='space-y-3'>
                {Object.entries(hours).map(([key, dayHours]) => {
                  const isToday =
                    key.toLowerCase() === currentDayName && !currentClosing;
                  return (
                    <div
                      key={key}
                      className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors ${
                        isToday
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-background-secondary/50'
                      }`}
                    >
                      <span
                        className={`font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}
                      >
                        {t(`days.${dayHours.day.toLowerCase()}`)}
                      </span>
                      <div
                        className={`text-sm ${isToday ? 'text-primary font-semibold' : 'text-foreground-secondary'}`}
                      >
                        {dayHours.isOpen ? (
                          <div className='space-y-1'>
                            {dayHours.periods.map((period, index) => (
                              <div key={index}>
                                {formatTime(period.open)} -{' '}
                                {formatTime(period.close)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          t('badge.closed')
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Contact & Location Card */}
            <Card className='bg-background-elevated border-border/50 shadow-lg'>
              <CardHeader className='pb-2'>
                <CardTitle className='flex items-center gap-3 text-2xl font-primary font-semibold text-foreground'>
                  <MapPin className='h-6 w-6 text-primary' />
                  {t('card.locationContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-start gap-3'>
                    <MapPin className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <p className='font-medium text-foreground'>
                        {t('card.address')}
                      </p>
                      <p className='text-foreground-secondary'>
                        {contact?.address?.street || 'Loading...'}
                        <br />
                        {contact?.address?.city || 'Loading...'},{' '}
                        {contact?.address?.state || 'Loading...'}{' '}
                        {contact?.address?.zipCode || 'Loading...'}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3'>
                    <Phone className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <p className='font-medium text-foreground'>
                        {t('card.phone')}
                      </p>
                      <p className='text-foreground-secondary'>
                        <a
                          href={`tel:${contact?.phone?.tel || '#'}`}
                          className='hover:text-primary transition-colors'
                        >
                          {contact?.phone?.display || 'Loading...'}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Theme-aware Location Map */}
                <div className='relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-border/30'>
                  <div className='flex items-center gap-2 mb-3'>
                    <MapPin className='h-4 w-4 text-primary' />
                    <span className='text-sm font-medium text-foreground'>
                      {t('card.ourLocation')}
                    </span>
                  </div>
                  <div className='relative aspect-[16/9] rounded border border-border/20 overflow-hidden'>
                    <Image
                      src='/static/location-map-light.webp'
                      alt='Restaurant location map'
                      fill
                      className='object-cover'
                      priority={false}
                    />
                  </div>
                  <p className='text-xs text-foreground-secondary mt-2 text-center'>
                    {contact?.address?.description || 'Loading...'}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <SmartCallButton
                    size='lg'
                    className='!bg-primary !text-primary-foreground px-4 py-3 text-base font-semibold shadow-lg md:hover:shadow-xl transition-all duration-300 md:hover:scale-105 hover:!bg-primary active:!bg-primary focus:!bg-primary'
                  >
                    <span className='flex items-center gap-2'>
                      <Phone className='h-4 w-4' />
                      {t('card.callNow')}
                    </span>
                  </SmartCallButton>

                  {/* Directions Button - Universal navigation link (works on all platforms, triggers native map picker on mobile) */}
                  <Button
                    asChild
                    size='lg'
                    className='!bg-secondary !text-secondary-foreground px-4 py-3 text-base font-semibold shadow-lg md:hover:shadow-xl transition-all duration-300 md:hover:scale-105 hover:!bg-secondary active:!bg-secondary focus:!bg-secondary'
                  >
                    <a
                      href={contact?.maps?.googleMaps || '#'}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2'
                      data-gtm-click='directions_button'
                    >
                      <MapPin className='h-4 w-4' />
                      {t('card.directions')}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Closings */}
          {upcomingClosings.length > 0 && (
            <div className='mt-12'>
              <h3 className='text-2xl font-primary font-semibold text-foreground text-center mb-6'>
                {t('upcomingClosings')}
              </h3>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {upcomingClosings.map(closing => (
                  <Card
                    key={closing.id}
                    className='bg-background-elevated border-border/50'
                  >
                    <CardContent className='p-4'>
                      <div className='flex items-start gap-3'>
                        <AlertCircle className='h-5 w-5 text-warning mt-0.5' />
                        <div>
                          <h4 className='font-semibold text-foreground mb-1'>
                            {closing.title}
                          </h4>
                          <p className='text-sm text-foreground-secondary mb-2'>
                            {closing.startDate && closing.endDate ? (
                              // Date range display
                              <>
                                {formatDateLocal(closing.startDate)}
                                {' - '}
                                {formatDateLocal(closing.endDate)}
                              </>
                            ) : (
                              // Single date display
                              formatDateLocal(closing.date!)
                            )}
                          </p>
                          <p className='text-sm text-foreground-secondary'>
                            {closing.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Special Messages */}
          {activeMessages.length > 0 && (
            <div className='mt-12 space-y-4'>
              <h3 className='text-2xl font-primary font-semibold text-foreground text-center mb-6'>
                {t('importantUpdates')}
              </h3>
              <div className='grid gap-4'>
                {activeMessages.map(message => (
                  <Alert
                    key={message.id}
                    variant={getAlertVariant(message.type)}
                    className='bg-background-elevated border-border/50'
                  >
                    {getAlertIcon(message.type)}
                    <AlertTitle className='text-foreground font-semibold'>
                      {message.title}
                    </AlertTitle>
                    <AlertDescription className='text-foreground-secondary'>
                      {message.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
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
import hoursConfig from '@/config/restaurant/hours.json';
import messagesConfig from '@/config/restaurant/messages.json';
import closingsConfig from '@/config/restaurant/closings.json';

interface OpeningHours {
  [key: string]: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  };
}

interface SpecialMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  priority: number;
}

interface Closing {
  id: string;
  title: string;
  description: string;
  date: string | null;
  startDate: string | null;
  endDate: string | null;
  isRecurring: boolean;
  isActive: boolean;
}

export default function OpeningHoursSection() {
  const t = useTranslations('hours');
  const tHero = useTranslations('hero');
  const hours = hoursConfig.openingHours as OpeningHours;
  const messages = messagesConfig.specialMessages as SpecialMessage[];
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

  // Get active messages sorted by priority
  const activeMessages = messages
    .filter(msg => msg.isActive)
    .filter(msg => {
      const now = new Date();
      const startDate = new Date(msg.startDate);
      const endDate = msg.endDate ? new Date(msg.endDate) : null;

      return now >= startDate && (!endDate || now <= endDate);
    })
    .sort((a, b) => a.priority - b.priority);

  // Get upcoming closings (future only, not current)
  const upcomingClosings = closings
    .filter(closing => closing.isActive)
    .filter(closing => {
      // Handle both single date and date range closings
      if (closing.startDate && closing.endDate) {
        // Date range closing - show if start date is in the future
        const startDate = new Date(closing.startDate);
        return startDate > now; // Changed from >= to > to exclude current
      } else if (closing.date) {
        // Single date closing
        const closingDate = new Date(closing.date);
        return closingDate > now; // Changed from >= to > to exclude current
      }
      return false;
    })
    .sort((a, b) => {
      // Sort by start date for date ranges, or by date for single dates
      const aDate = a.startDate ? new Date(a.startDate) : new Date(a.date!);
      const bDate = b.startDate ? new Date(b.startDate) : new Date(b.date!);
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, 3); // Show only next 3 closings

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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Helper function to format dates consistently (avoiding hydration mismatch)
  const formatDate = (
    dateString: string,
    options: Intl.DateTimeFormatOptions = {}
  ) => {
    if (!isMounted) {
      // Return a placeholder during SSR to avoid hydration mismatch
      return 'Loading...';
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    });
  };

  const formatDateTime = (
    dateString: string,
    options: Intl.DateTimeFormatOptions = {}
  ) => {
    if (!isMounted) {
      return 'Loading...';
    }

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      ...options,
    });
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
                          from: formatDateTime(currentClosing.startDate),
                          until: formatDateTime(currentClosing.endDate),
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
                    }`}
                  >
                    {currentClosing
                      ? t('badge.currentlyClosed')
                      : isCurrentlyOpen
                        ? tHero('badge.openNow')
                        : isOpeningSoon && minutesUntilOpening <= 60
                          ? tHero('badge.openingIn', {
                              minutes: minutesUntilOpening,
                              plural: minutesUntilOpening === 1 ? '' : 's',
                            })
                          : tHero('badge.closed')}
                  </Badge>
                  <span className='text-sm text-foreground-secondary'>
                    {currentClosing
                      ? t('badge.temporarilyClosedNote')
                      : isCurrentlyOpen
                        ? t('badge.openUntil', {
                            time: formatTime(todayHours.close),
                          })
                        : isOpeningSoon && minutesUntilOpening <= 60
                          ? t('badge.openingAt', {
                              time: formatTime(todayHours.open),
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
                        {dayHours.day}
                      </span>
                      <span
                        className={`text-sm ${isToday ? 'text-primary font-semibold' : 'text-foreground-secondary'}`}
                      >
                        {dayHours.isOpen
                          ? `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`
                          : 'Closed'}
                      </span>
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
                <div className='space-y-4'>
                  <div className='flex items-start gap-3'>
                    <MapPin className='h-5 w-5 text-primary mt-0.5' />
                    <div>
                      <p className='font-medium text-foreground'>
                        {t('card.address')}
                      </p>
                      <p className='text-foreground-secondary'>
                        123 Pizza Street
                        <br />
                        Little Italy, NY 10013
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
                          href='tel:+1234567890'
                          className='hover:text-primary transition-colors'
                        >
                          (123) 456-7890
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lightweight Map Placeholder */}
                <div className='relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border border-border/30'>
                  <div className='flex items-center gap-2 mb-3'>
                    <MapPin className='h-4 w-4 text-primary' />
                    <span className='text-sm font-medium text-foreground'>
                      {t('card.ourLocation')}
                    </span>
                  </div>
                  <div className='relative h-32 bg-gradient-to-br from-background-secondary to-background-tertiary rounded border border-border/20 overflow-hidden'>
                    {/* Simple city map representation */}
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10' />
                    <div className='absolute inset-0 opacity-20'>
                      {/* Grid pattern for map-like appearance */}
                      <div
                        className='w-full h-full'
                        style={{
                          backgroundImage: `
                          linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                        `,
                          backgroundSize: '20px 20px',
                        }}
                      />
                    </div>
                    {/* Location pin */}
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                      <div className='w-6 h-6 bg-primary rounded-full border-2 border-background shadow-lg flex items-center justify-center'>
                        <div className='w-2 h-2 bg-background rounded-full' />
                      </div>
                    </div>
                    {/* Streets representation */}
                    <div className='absolute top-1/3 left-0 right-0 h-0.5 bg-foreground/20' />
                    <div className='absolute top-2/3 left-0 right-0 h-0.5 bg-foreground/20' />
                    <div className='absolute top-0 bottom-0 left-1/3 w-0.5 bg-foreground/20' />
                    <div className='absolute top-0 bottom-0 right-1/3 w-0.5 bg-foreground/20' />
                  </div>
                  <p className='text-xs text-foreground-secondary mt-2 text-center'>
                    Located in the heart of Little Italy
                  </p>
                </div>

                {/* Quick Actions */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <a
                    href='tel:+1234567890'
                    className='flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors'
                  >
                    <Phone className='h-4 w-4' />
                    {t('card.callNow')}
                  </a>
                  <a
                    href='https://maps.google.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors'
                  >
                    <MapPin className='h-4 w-4' />
                    {t('card.directions')}
                  </a>
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
                                {formatDate(closing.startDate)}
                                {' - '}
                                {formatDate(closing.endDate)}
                              </>
                            ) : (
                              // Single date display
                              formatDate(closing.date!)
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

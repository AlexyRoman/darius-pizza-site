'use client';
import { useEffect, useState } from 'react';

function formatHourMinute(
  date: Date,
  timeZone: string,
  locale: string
): { hour: string; minute: string } {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).formatToParts(date);

    const hourPart = parts.find(p => p.type === 'hour')?.value ?? '';
    const minutePart = parts.find(p => p.type === 'minute')?.value ?? '';

    const hour = hourPart.padStart(2, '0');
    const minute = minutePart.padStart(2, '0');
    return { hour, minute };
  } catch {
    // Fallback without timezone if the above fails for some reason
    const parts = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date);
    const hourPart = parts.find(p => p.type === 'hour')?.value ?? '';
    const minutePart = parts.find(p => p.type === 'minute')?.value ?? '';
    const hour = hourPart.padStart(2, '0');
    const minute = minutePart.padStart(2, '0');
    return { hour, minute };
  }
}

export function TimeClock({
  timeZone,
  locale,
}: {
  timeZone: string;
  locale: string;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const [showColon, setShowColon] = useState<boolean>(true);

  useEffect(() => {
    setNow(new Date());
    const minuteTick = setInterval(() => setNow(new Date()), 30_000);
    const colonTick = setInterval(() => setShowColon(v => !v), 1_000);
    return () => {
      clearInterval(minuteTick);
      clearInterval(colonTick);
    };
  }, []);

  const { hour, minute } = now
    ? formatHourMinute(now, timeZone, locale)
    : { hour: '--', minute: '--' };

  return (
    <span
      data-testid='time-clock'
      className='text-sm text-muted-foreground tabular-nums'
    >
      {hour}
      <span className={showColon ? 'opacity-100' : 'opacity-0'}>:</span>
      {minute}
    </span>
  );
}

export default TimeClock;

'use client';
import { useEffect, useState } from 'react';

function formatTime(date: Date, timeZone: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
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

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const display = now ? formatTime(now, timeZone, locale) : '--:--';

  return (
    <span
      data-testid='time-clock'
      className='text-sm text-muted-foreground tabular-nums'
    >
      {display}
    </span>
  );
}

export default TimeClock;

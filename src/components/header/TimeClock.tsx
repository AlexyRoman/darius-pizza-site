'use client';
import { useEffect, useState } from 'react';
import { formatHourMinute } from '@/lib/date-utils';

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

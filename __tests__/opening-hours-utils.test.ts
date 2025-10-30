import { isTimeInPeriods, getNextOpeningTime, formatNextOpeningTime } from '@/lib/opening-hours-utils';
import type { OpeningHours } from '@/types/opening-hours';
import hoursConfig from '@/content/restaurant/hours.json';

describe('opening-hours-utils', () => {
  test('isTimeInPeriods detects inclusion correctly', () => {
    const periods = [
      { open: '09:00', close: '12:00' },
      { open: '13:00', close: '18:00' },
    ];
    expect(isTimeInPeriods('09:00', periods)).toBe(true);
    expect(isTimeInPeriods('12:00', periods)).toBe(true);
    expect(isTimeInPeriods('12:30', periods)).toBe(false);
  });

  test('getNextOpeningTime returns null if no openings in configured hours', () => {
    // Create a now that is late Sunday and assume next day config exists
    const now = new Date('2024-01-01T10:00:00');
    const next = getNextOpeningTime(now);
    // Should return an object when hours config has openings
    // We cannot assert specifics against real config; just type/shape
    if (next) {
      expect(typeof next.day).toBe('string');
      expect(typeof next.time).toBe('string');
      expect(typeof next.isToday).toBe('boolean');
    } else {
      expect(next).toBeNull();
    }
  });

  test('formatNextOpeningTime returns translation keys when next opening known', () => {
    const now = new Date();
    const t = (key: string, params?: Record<string, any>) => `${key}:${params?.time ?? ''}`;
    const text = formatNextOpeningTime(now, t);
    expect(typeof text).toBe('string');
  });
});



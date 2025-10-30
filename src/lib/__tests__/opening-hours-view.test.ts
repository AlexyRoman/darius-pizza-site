import {
  computeIsCurrentlyOpen,
  computeIsOpeningSoon,
  getMinutesUntilOpening,
  getCurrentPeriodInfo,
  getUpcomingClosings,
  getActiveMessages,
  formatTimeForLocale,
  getTodayHours,
} from '@/lib/opening-hours-view';
import type {
  OpeningHours as OpeningHoursMap,
  DayHours,
} from '@/types/opening-hours';

const hours: OpeningHoursMap = {
  monday: {
    day: 'Monday',
    isOpen: true,
    periods: [
      { open: '11:00', close: '14:00' },
      { open: '18:00', close: '22:00' },
    ],
  },
} as const;

describe('opening-hours-view helpers', () => {
  it('getTodayHours returns day by name', () => {
    expect(getTodayHours(hours, 'monday')?.day).toBe('Monday');
  });

  it('computeIsCurrentlyOpen true during period', () => {
    expect(computeIsCurrentlyOpen(hours.monday as DayHours, '11:30')).toBe(
      true
    );
    expect(computeIsCurrentlyOpen(hours.monday as DayHours, '15:00')).toBe(
      false
    );
  });

  it('computeIsOpeningSoon detects within 60 minutes window', () => {
    // 10:30 -> opens at 11:00
    expect(computeIsOpeningSoon(hours.monday as DayHours, '10:30', 60)).toBe(
      true
    );
    // 10:00 -> still within 60m window => true
    expect(computeIsOpeningSoon(hours.monday as DayHours, '10:00', 60)).toBe(
      true
    );
    // 09:59 -> outside window => false
    expect(computeIsOpeningSoon(hours.monday as DayHours, '09:59', 60)).toBe(
      false
    );
  });

  it('getMinutesUntilOpening computes minutes', () => {
    expect(getMinutesUntilOpening(hours.monday as DayHours, '10:30')).toBe(30);
    expect(getMinutesUntilOpening(hours.monday as DayHours, '10:59')).toBe(1);
  });

  it('getCurrentPeriodInfo returns current and next periods', () => {
    const info = getCurrentPeriodInfo(hours.monday as DayHours, '11:30');
    expect(info.currentPeriod).toEqual({ open: '11:00', close: '14:00' });
    const info2 = getCurrentPeriodInfo(hours.monday as DayHours, '15:00');
    expect(info2.currentPeriod).toBeUndefined();
    expect(info2.nextOpeningPeriod).toEqual({ open: '18:00', close: '22:00' });
  });

  it('getUpcomingClosings filters future closings', () => {
    const now = new Date('2024-01-01T12:00:00Z');
    const closings = [
      { id: '1', isActive: true, date: '2024-01-02' },
      {
        id: '2',
        isActive: true,
        startDate: '2024-01-03',
        endDate: '2024-01-04',
      },
      { id: '3', isActive: true, date: '2023-12-31' },
    ];
    const result = getUpcomingClosings(closings, now, 3);
    expect(result.map(c => c.id)).toEqual(['1', '2']);
  });

  it('getActiveMessages returns active and sorted by priority', () => {
    const now = new Date('2024-01-02T12:00:00Z');
    const messages = [
      {
        isActive: true,
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        priority: 2,
      },
      {
        isActive: true,
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        priority: 1,
      },
      {
        isActive: false,
        startDate: '2024-01-01',
        endDate: '2024-01-03',
        priority: 0,
      },
    ];
    const result = getActiveMessages(messages, now);
    expect(result.map(m => m.priority)).toEqual([1, 2]);
  });

  it('formatTimeForLocale respects locale', () => {
    const formattedEn = formatTimeForLocale('18:05', 'en');
    const formattedFr = formatTimeForLocale('18:05', 'fr');
    expect(formattedEn).toMatch(/6:05/i);
    expect(formattedFr).toMatch(/18:05/);
  });
});

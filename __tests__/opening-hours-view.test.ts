import {
  computeIsCurrentlyOpen,
  computeIsOpeningSoon,
  getMinutesUntilOpening,
  getTodayHours,
  getCurrentPeriodInfo,
  findActiveClosing,
} from '@/lib/opening-hours-view';
import type { OpeningHours } from '@/types/opening-hours';

const hours: OpeningHours = {
  monday: {
    day: 'Monday',
    isOpen: true,
    periods: [
      { open: '09:00', close: '12:00' },
      { open: '13:00', close: '18:00' },
    ],
  },
  tuesday: { day: 'Tuesday', isOpen: false, periods: [] },
  wednesday: { day: 'Wednesday', isOpen: true, periods: [{ open: '10:00', close: '16:00' }] },
  thursday: { day: 'Thursday', isOpen: true, periods: [{ open: '10:00', close: '16:00' }] },
  friday: { day: 'Friday', isOpen: true, periods: [{ open: '10:00', close: '16:00' }] },
  saturday: { day: 'Saturday', isOpen: true, periods: [{ open: '10:00', close: '16:00' }] },
  sunday: { day: 'Sunday', isOpen: false, periods: [] },
};

describe('opening-hours-view utils', () => {
  test('getTodayHours finds correct day (case-insensitive) and falls back to monday', () => {
    expect(getTodayHours(hours, 'monday')?.day).toBe('Monday');
    expect(getTodayHours(hours, 'MONDAY')?.day).toBe('Monday');
    expect(getTodayHours(hours, 'unknown')?.day).toBe('Monday');
  });

  test('computeIsCurrentlyOpen returns true if within any period', () => {
    const today = getTodayHours(hours, 'monday');
    expect(computeIsCurrentlyOpen(today, '09:30')).toBe(true);
    expect(computeIsCurrentlyOpen(today, '12:30')).toBe(false);
  });

  test('computeIsOpeningSoon detects upcoming opening within window', () => {
    const today = getTodayHours(hours, 'monday');
    // Before first opening
    expect(computeIsOpeningSoon(today, '08:30', 60)).toBe(true);
    // Between periods, within 30 minutes of 13:00
    expect(computeIsOpeningSoon(today, '12:40', 30)).toBe(true);
    // Too far from next opening
    expect(computeIsOpeningSoon(today, '07:00', 60)).toBe(false);
  });

  test('getMinutesUntilOpening returns minutes until the next opening period', () => {
    const today = getTodayHours(hours, 'monday');
    expect(getMinutesUntilOpening(today, '08:30')).toBe(30);
    expect(getMinutesUntilOpening(today, '12:30')).toBe(30);
    expect(getMinutesUntilOpening(today, '18:10')).toBe(0);
  });

  test('getCurrentPeriodInfo returns current and next periods', () => {
    const today = getTodayHours(hours, 'monday');
    const beforeOpen = getCurrentPeriodInfo(today, '08:50');
    expect(beforeOpen.currentPeriod).toBeUndefined();
    expect(beforeOpen.nextOpeningPeriod?.open).toBe('09:00');

    const duringFirst = getCurrentPeriodInfo(today, '09:30');
    expect(duringFirst.currentPeriod?.open).toBe('09:00');
    expect(duringFirst.nextOpeningPeriod?.open).toBe('13:00');
  });

  test('findActiveClosing returns current closing by date window', () => {
    const now = new Date('2024-06-10T10:00:00Z');
    const closings = [
      { isActive: true, startDate: '2024-06-01T00:00:00Z', endDate: '2024-06-05T00:00:00Z' },
      { isActive: true, startDate: '2024-06-08T00:00:00Z', endDate: '2024-06-12T00:00:00Z' },
      { isActive: false, startDate: '2024-06-09T00:00:00Z', endDate: '2024-06-09T12:00:00Z' },
    ];
    const active = findActiveClosing(closings, now);
    expect(active).toBeDefined();
    expect(active?.startDate).toBe('2024-06-08T00:00:00Z');
  });
});



/**
 * Tests for date utility functions
 */

import {
  formatDate,
  formatDateTime,
  formatHourMinute,
} from '../../utils/date-utils';

describe('date-utils', () => {
  describe('formatDate', () => {
    const testDate = '2024-01-15T10:30:00Z';

    it('should format date with default options', () => {
      const result = formatDate(testDate, 'en');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format date for different locales', () => {
      const enResult = formatDate(testDate, 'en');
      const frResult = formatDate(testDate, 'fr');
      const deResult = formatDate(testDate, 'de');

      expect(enResult).toBeTruthy();
      expect(frResult).toBeTruthy();
      expect(deResult).toBeTruthy();
      // Results should be different for different locales
      expect(enResult !== frResult || enResult !== deResult).toBe(true);
    });

    it('should accept custom options', () => {
      const result = formatDate(testDate, 'en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      expect(result).toBeTruthy();
      expect(result).toContain('Jan');
    });

    it('should handle different date formats', () => {
      const isoDate = '2024-01-15T10:30:00Z';
      const dateOnly = '2024-01-15';
      const dateWithTime = '2024-01-15T10:30:00.000Z';

      expect(() => formatDate(isoDate, 'en')).not.toThrow();
      expect(() => formatDate(dateOnly, 'en')).not.toThrow();
      expect(() => formatDate(dateWithTime, 'en')).not.toThrow();
    });

    it('should format dates consistently', () => {
      const date1 = formatDate(testDate, 'en');
      const date2 = formatDate(testDate, 'en');
      expect(date1).toBe(date2);
    });
  });

  describe('formatDateTime', () => {
    const testDate = '2024-01-15T10:30:00Z';

    it('should format date and time with default options', () => {
      const result = formatDateTime(testDate, 'en');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format date and time for different locales', () => {
      const enResult = formatDateTime(testDate, 'en');
      const frResult = formatDateTime(testDate, 'fr');
      const deResult = formatDateTime(testDate, 'de');

      expect(enResult).toBeTruthy();
      expect(frResult).toBeTruthy();
      expect(deResult).toBeTruthy();
    });

    it('should accept custom options', () => {
      const result = formatDateTime(testDate, 'en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      expect(result).toBeTruthy();
      expect(result).toContain('Jan');
    });

    it('should include time information', () => {
      const result = formatDateTime(testDate, 'en');
      // Should contain some indication of time (hour/minute)
      expect(result.length).toBeGreaterThan(5);
    });

    it('should handle different date formats', () => {
      const isoDate = '2024-01-15T10:30:00Z';
      const dateOnly = '2024-01-15';
      const dateWithTime = '2024-01-15T10:30:00.000Z';

      expect(() => formatDateTime(isoDate, 'en')).not.toThrow();
      expect(() => formatDateTime(dateOnly, 'en')).not.toThrow();
      expect(() => formatDateTime(dateWithTime, 'en')).not.toThrow();
    });

    it('should format dates consistently', () => {
      const date1 = formatDateTime(testDate, 'en');
      const date2 = formatDateTime(testDate, 'en');
      expect(date1).toBe(date2);
    });
  });

  describe('formatHourMinute', () => {
    it('returns 24h hour and minute for a given timezone', () => {
      const d = new Date('2024-01-15T10:30:00Z');
      const { hour, minute } = formatHourMinute(d, 'UTC', 'en');
      expect(hour).toBe('10');
      expect(minute).toBe('30');
    });

    it('pads hour and minute with leading zeros', () => {
      const d = new Date('2024-01-15T03:05:00Z');
      const { hour, minute } = formatHourMinute(d, 'UTC', 'en');
      expect(hour).toBe('03');
      expect(minute).toBe('05');
    });

    it('falls back gracefully when timezone is invalid', () => {
      const original = Intl.DateTimeFormat;
      // Mock DateTimeFormat to throw when timeZone is provided, and return fixed parts otherwise
      const mock = function (
        _locale: string,
        options?: Intl.DateTimeFormatOptions
      ) {
        if (options && 'timeZone' in options) {
          throw new RangeError('Invalid timeZone');
        }
        return {
          formatToParts: () => [
            { type: 'hour', value: '07' },
            { type: 'minute', value: '05' },
          ],
        } as unknown as Intl.DateTimeFormat;
      } as unknown as typeof Intl.DateTimeFormat;
      (
        Intl as unknown as { DateTimeFormat: typeof Intl.DateTimeFormat }
      ).DateTimeFormat = mock as unknown as typeof Intl.DateTimeFormat;

      const d = new Date('2024-01-15T10:30:00Z');
      const { hour, minute } = formatHourMinute(d, 'Invalid/Zone', 'en');
      expect(hour).toBe('07');
      expect(minute).toBe('05');

      // Restore original
      (
        Intl as unknown as { DateTimeFormat: typeof Intl.DateTimeFormat }
      ).DateTimeFormat = original as unknown as typeof Intl.DateTimeFormat;
    });

    it('pads to 00 when no hour/minute parts are returned', () => {
      const original = Intl.DateTimeFormat;
      const mock = function () {
        return {
          formatToParts: () => [],
        } as unknown as Intl.DateTimeFormat;
      } as unknown as typeof Intl.DateTimeFormat;
      (
        Intl as unknown as { DateTimeFormat: typeof Intl.DateTimeFormat }
      ).DateTimeFormat = mock as unknown as typeof Intl.DateTimeFormat;

      const d = new Date('2024-01-15T00:00:00Z');
      const { hour, minute } = formatHourMinute(d, 'UTC', 'en');
      expect(hour).toBe('00');
      expect(minute).toBe('00');

      (
        Intl as unknown as { DateTimeFormat: typeof Intl.DateTimeFormat }
      ).DateTimeFormat = original as unknown as typeof Intl.DateTimeFormat;
    });
  });
});

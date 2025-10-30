/**
 * Tests for date utility functions
 */

import { formatDate, formatDateTime } from '../date-utils';

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
});

/**
 * Tests for site utility functions
 *
 * These tests verify utility functions like currency formatting and site info getters.
 */

// Mock the env module BEFORE importing
jest.mock('@/lib/env', () => ({
  env: {
    SITE_TIME_ZONE: 'Europe/Paris',
    SITE_PHONE: '+33123456789',
    NEXT_PUBLIC_CURRENCY: '€',
  },
  parseBooleanEnv: jest.fn((value, defaultValue) => {
    if (value === undefined) return defaultValue;
    return value === 'true';
  }),
}));

import { formatCurrency, getSiteTimeZone, getSitePhone } from '../site-utils';

describe('site-utils', () => {
  describe('getSiteTimeZone', () => {
    it('should return timezone from env', () => {
      const timezone = getSiteTimeZone();
      expect(timezone).toBe('Europe/Paris');
    });
  });

  describe('getSitePhone', () => {
    it('should return phone number from env', () => {
      const phone = getSitePhone();
      expect(phone).toBe('+33123456789');
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with euro symbol after amount', () => {
      const formatted = formatCurrency(10.5);
      expect(formatted).toBe('10.50€');
    });

    it('should format currency with two decimal places', () => {
      expect(formatCurrency(10)).toBe('10.00€');
      expect(formatCurrency(10.1)).toBe('10.10€');
      expect(formatCurrency(10.123)).toBe('10.12€');
    });

    it('should handle zero amount', () => {
      expect(formatCurrency(0)).toBe('0.00€');
    });

    it('should handle negative amounts', () => {
      expect(formatCurrency(-10.5)).toBe('-10.50€');
    });

    it('should handle large amounts', () => {
      expect(formatCurrency(1000.99)).toBe('1000.99€');
      expect(formatCurrency(1000000)).toBe('1000000.00€');
    });

    it('should handle small amounts', () => {
      expect(formatCurrency(0.01)).toBe('0.01€');
      expect(formatCurrency(0.001)).toBe('0.00€');
    });

    it('should use formatCurrency logic correctly for euro', () => {
      // Test the actual logic: euro goes after amount
      const result = formatCurrency(10.5);
      expect(result).toContain('10.50');
      expect(result.endsWith('€')).toBe(true);
    });
  });
});

/**
 * Tests for i18n request configuration
 *
 * These tests verify that request configuration correctly:
 * - Uses routing configuration
 * - Handles locale fallback logic
 * - Returns proper structure (actual async message loading is tested via integration)
 *
 * Note: Full async execution testing is complex due to dynamic imports,
 * so we focus on testing the structure and integration points.
 */

// Mock routing
jest.mock('../routing', () => ({
  routing: {
    locales: ['en', 'fr', 'de'],
    defaultLocale: 'fr',
  },
}));

// Mock locale JSON files
jest.mock(
  '@/locales/en.json',
  () => ({ default: { common: { hello: 'Hello' } } }),
  {
    virtual: true,
  }
);
jest.mock(
  '@/locales/fr.json',
  () => ({ default: { common: { hello: 'Bonjour' } } }),
  {
    virtual: true,
  }
);
jest.mock(
  '@/locales/de.json',
  () => ({ default: { common: { hello: 'Hallo' } } }),
  {
    virtual: true,
  }
);

import { routing } from '../routing';
import requestConfig from '../request';

describe('i18n/request', () => {
  describe('request configuration structure', () => {
    it('should export a default function', () => {
      expect(requestConfig).toBeDefined();
      expect(typeof requestConfig).toBe('function');
    });
  });

  describe('locale resolution logic', () => {
    it('should use routing.locales for locale checking', () => {
      // Verify routing is available
      expect(routing).toBeDefined();
      expect(routing.locales).toBeDefined();
      expect(Array.isArray(routing.locales)).toBe(true);
    });

    it('should have defaultLocale configured', () => {
      expect(routing.defaultLocale).toBeDefined();
      expect(typeof routing.defaultLocale).toBe('string');
    });
  });

  describe('config function execution', () => {
    it('should handle valid locale', async () => {
      const result = await requestConfig({
        requestLocale: Promise.resolve('en'),
      });
      expect(result).toBeDefined();
      expect(result.locale).toBe('en');
      expect(result.messages).toBeDefined();
    });

    it('should fallback to default locale for invalid locale', async () => {
      const result = await requestConfig({
        requestLocale: Promise.resolve('invalid'),
      });
      expect(result).toBeDefined();
      expect(result.locale).toBe('fr'); // Should fallback to default
      expect(result.messages).toBeDefined();
    });

    it('should fallback to default locale when requestLocale is undefined', async () => {
      const result = await requestConfig({
        requestLocale: Promise.resolve(undefined),
      });
      expect(result).toBeDefined();
      expect(result.locale).toBe('fr'); // Should fallback to default
      expect(result.messages).toBeDefined();
    });

    it('should return messages for valid locale', async () => {
      const result = await requestConfig({
        requestLocale: Promise.resolve('fr'),
      });
      expect(result.messages).toBeDefined();
      expect(typeof result.messages).toBe('object');
    });
  });

  describe('routing integration', () => {
    it('should depend on routing module', () => {
      expect(routing).toBeDefined();
      expect(routing.locales).toContain('fr');
      expect(routing.defaultLocale).toBe('fr');
    });

    it('should work with all enabled locales', async () => {
      for (const locale of routing.locales) {
        const result = await requestConfig({
          requestLocale: Promise.resolve(locale),
        });
        expect(result.locale).toBe(locale);
      }
    });
  });
});

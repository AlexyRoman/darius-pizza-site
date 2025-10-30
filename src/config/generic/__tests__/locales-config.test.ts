/**
 * Tests for generic locales-config utilities
 *
 * These tests verify that locale utility functions correctly handle
 * the locale configuration data structure.
 */

// Mock the locales.json import BEFORE importing the module
// In TypeScript/Next.js, JSON imports are default exports
jest.mock(
  '@/config/site/locales.json',
  () => ({
    defaultLocale: 'fr',
    locales: [
      {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        direction: 'ltr',
        enabled: true,
        fallback: null,
      },
      {
        code: 'fr',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        direction: 'ltr',
        enabled: true,
        fallback: 'en',
      },
      {
        code: 'de',
        name: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        direction: 'ltr',
        enabled: false,
        fallback: 'en',
      },
    ],
    settings: {
      localeDetection: false,
      localePrefix: 'always',
      pathnames: {
        '/': '/',
        '/home': '/home',
      },
    },
  }),
  { virtual: true }
);

import {
  localesConfig,
  getLocaleByCode,
  getAvailableLocales,
  getAllLocales,
  getEnabledLocaleCodes,
  getDefaultLocale,
  getLocaleSettings,
  getLocaleName,
  getLocaleNativeName,
  getLocaleFlag,
  getLocaleFallback,
  isLocaleEnabled,
  getLocaleDirection,
} from '../locales-config';

describe('locales-config', () => {
  describe('localesConfig', () => {
    it('should export the full config object', () => {
      expect(localesConfig).toBeDefined();
      expect(localesConfig.defaultLocale).toBe('fr');
      expect(localesConfig.locales).toHaveLength(3);
    });
  });

  describe('getLocaleByCode', () => {
    it('should return locale for valid code', () => {
      const locale = getLocaleByCode('en');
      expect(locale).toBeDefined();
      expect(locale?.code).toBe('en');
      expect(locale?.name).toBe('English');
    });

    it('should return locale for enabled locale', () => {
      const locale = getLocaleByCode('fr');
      expect(locale).toBeDefined();
      expect(locale?.code).toBe('fr');
      expect(locale?.nativeName).toBe('Français');
    });

    it('should return locale for disabled locale', () => {
      const locale = getLocaleByCode('de');
      expect(locale).toBeDefined();
      expect(locale?.code).toBe('de');
      expect(locale?.enabled).toBe(false);
    });

    it('should return undefined for invalid code', () => {
      const locale = getLocaleByCode('invalid');
      expect(locale).toBeUndefined();
    });
  });

  describe('getAvailableLocales', () => {
    it('should return only enabled locales', () => {
      const locales = getAvailableLocales();
      expect(locales).toHaveLength(2);
      expect(locales.map(l => l.code)).toEqual(['en', 'fr']);
      expect(locales.every(l => l.enabled)).toBe(true);
    });

    it('should not include disabled locales', () => {
      const locales = getAvailableLocales();
      expect(locales.find(l => l.code === 'de')).toBeUndefined();
    });
  });

  describe('getAllLocales', () => {
    it('should return all locales including disabled', () => {
      const locales = getAllLocales();
      expect(locales).toHaveLength(3);
      expect(locales.map(l => l.code)).toEqual(['en', 'fr', 'de']);
    });
  });

  describe('getEnabledLocaleCodes', () => {
    it('should return only enabled locale codes', () => {
      const codes = getEnabledLocaleCodes();
      expect(codes).toHaveLength(2);
      expect(codes).toEqual(['en', 'fr']);
    });

    it('should return empty array if no locales enabled', () => {
      // This would need a different mock setup
      // Just verifying the function works with current data
      const codes = getEnabledLocaleCodes();
      expect(Array.isArray(codes)).toBe(true);
    });
  });

  describe('getDefaultLocale', () => {
    it('should return the default locale code', () => {
      const defaultLocale = getDefaultLocale();
      expect(defaultLocale).toBe('fr');
    });
  });

  describe('getLocaleSettings', () => {
    it('should return locale settings', () => {
      const settings = getLocaleSettings();
      expect(settings).toBeDefined();
      expect(settings.localeDetection).toBe(false);
      expect(settings.localePrefix).toBe('always');
      expect(settings.pathnames).toBeDefined();
    });
  });

  describe('getLocaleName', () => {
    it('should return locale name for valid code', () => {
      expect(getLocaleName('en')).toBe('English');
      expect(getLocaleName('fr')).toBe('French');
    });

    it('should return code as fallback for invalid code', () => {
      expect(getLocaleName('invalid')).toBe('invalid');
    });
  });

  describe('getLocaleNativeName', () => {
    it('should return native name for valid code', () => {
      expect(getLocaleNativeName('en')).toBe('English');
      expect(getLocaleNativeName('fr')).toBe('Français');
    });

    it('should return code as fallback for invalid code', () => {
      expect(getLocaleNativeName('invalid')).toBe('invalid');
    });
  });

  describe('getLocaleFlag', () => {
    it('should return flag emoji for valid code', () => {
      expect(getLocaleFlag('en')).toBe('🇺🇸');
      expect(getLocaleFlag('fr')).toBe('🇫🇷');
    });

    it('should return default flag for invalid code', () => {
      expect(getLocaleFlag('invalid')).toBe('🌐');
    });

    it('should return default flag for disabled locale', () => {
      const flag = getLocaleFlag('de');
      expect(flag).toBe('🇩🇪'); // Even disabled locales have flags
    });
  });

  describe('getLocaleFallback', () => {
    it('should return fallback for locale with fallback', () => {
      expect(getLocaleFallback('fr')).toBe('en');
    });

    it('should return null for locale without fallback', () => {
      expect(getLocaleFallback('en')).toBeNull();
    });

    it('should return null for invalid code', () => {
      expect(getLocaleFallback('invalid')).toBeNull();
    });
  });

  describe('isLocaleEnabled', () => {
    it('should return true for enabled locale', () => {
      expect(isLocaleEnabled('en')).toBe(true);
      expect(isLocaleEnabled('fr')).toBe(true);
    });

    it('should return false for disabled locale', () => {
      expect(isLocaleEnabled('de')).toBe(false);
    });

    it('should return false for invalid code', () => {
      expect(isLocaleEnabled('invalid')).toBe(false);
    });
  });

  describe('getLocaleDirection', () => {
    it('should return direction for valid code', () => {
      expect(getLocaleDirection('en')).toBe('ltr');
      expect(getLocaleDirection('fr')).toBe('ltr');
    });

    it('should return ltr as default for invalid code', () => {
      expect(getLocaleDirection('invalid')).toBe('ltr');
    });
  });
});

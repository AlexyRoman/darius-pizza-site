/**
 * Tests for OG metadata utility functions
 */

// Mock the locales-config module
jest.mock('@/config/generic/locales-config', () => ({
  getLocaleByCode: jest.fn((code: string) => {
    const locales: Record<
      string,
      { name: string; flag: string; nativeName: string }
    > = {
      en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
      fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
      de: { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
      es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    };
    return locales[code];
  }),
}));

import { getLocaleMetadata } from '../og-metadata';

describe('og-metadata', () => {
  describe('getLocaleMetadata', () => {
    it('should return locale metadata for valid locale code', () => {
      const result = getLocaleMetadata('en');
      expect(result).toEqual({
        name: 'English',
        flag: '🇬🇧',
        nativeName: 'English',
      });
    });

    it('should return locale metadata for French locale', () => {
      const result = getLocaleMetadata('fr');
      expect(result).toEqual({
        name: 'French',
        flag: '🇫🇷',
        nativeName: 'Français',
      });
    });

    it('should return locale metadata for German locale', () => {
      const result = getLocaleMetadata('de');
      expect(result).toEqual({
        name: 'German',
        flag: '🇩🇪',
        nativeName: 'Deutsch',
      });
    });

    it('should return locale metadata for Spanish locale', () => {
      const result = getLocaleMetadata('es');
      expect(result).toEqual({
        name: 'Spanish',
        flag: '🇪🇸',
        nativeName: 'Español',
      });
    });

    it('should fallback to English when locale not found', () => {
      // Mock getLocaleByCode to return undefined for invalid code
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getLocaleByCode } = require('@/config/generic/locales-config');
      getLocaleByCode.mockImplementationOnce((code: string) => {
        if (code === 'invalid') return undefined;
        const locales: Record<
          string,
          { name: string; flag: string; nativeName: string }
        > = {
          en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
        };
        return locales[code];
      });

      const result = getLocaleMetadata('invalid');
      expect(result).toEqual({
        name: 'English',
        flag: '🇬🇧',
        nativeName: 'English',
      });
    });

    it('should use fallback values when English locale is also not found', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getLocaleByCode } = require('@/config/generic/locales-config');
      getLocaleByCode.mockImplementation(() => undefined);

      const result = getLocaleMetadata('invalid');
      expect(result).toEqual({
        name: 'English',
        flag: '🌐',
        nativeName: 'English',
      });
    });

    it('should handle empty string locale code', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { getLocaleByCode } = require('@/config/generic/locales-config');
      getLocaleByCode.mockImplementation(() => undefined);

      const result = getLocaleMetadata('');
      expect(result).toEqual({
        name: 'English',
        flag: '🌐',
        nativeName: 'English',
      });
    });
  });
});

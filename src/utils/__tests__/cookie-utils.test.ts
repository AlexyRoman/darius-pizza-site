/**
 * Unit tests for cookie utility functions
 */

import {
  setCookie,
  getCookie,
  hasConsent,
  getCookiePreferences,
  saveCookieConsent,
  type CookiePreferences,
} from '../cookie-utils';

describe('cookie-utils', () => {
  // Mock window and document before each test
  beforeEach(() => {
    // Clear all cookies
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name =
        eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setCookie', () => {
    it('should set a cookie with default expiration (365 days)', () => {
      setCookie('testCookie', 'testValue');

      const cookie = document.cookie;
      expect(cookie).toContain('testCookie=testValue');
      // Note: document.cookie only shows name=value pairs, not attributes
      expect(getCookie('testCookie')).toBe('testValue');
    });

    it('should set a cookie with custom expiration', () => {
      setCookie('testCookie', 'testValue', 30);

      const cookie = document.cookie;
      expect(cookie).toContain('testCookie=testValue');
      expect(getCookie('testCookie')).toBe('testValue');
    });

    it('should URL encode cookie values', () => {
      setCookie('testCookie', 'value with spaces & special chars');

      const cookie = document.cookie;
      expect(cookie).toContain(
        'testCookie=value%20with%20spaces%20%26%20special%20chars'
      );
    });

    it('should handle empty string values', () => {
      setCookie('testCookie', '');

      const cookie = document.cookie;
      expect(cookie).toContain('testCookie=');
    });

    it('should not throw error in SSR environment (no window)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally removing window for SSR test
      delete global.window;

      expect(() => setCookie('testCookie', 'testValue')).not.toThrow();

      global.window = originalWindow;
    });
  });

  describe('getCookie', () => {
    it('should retrieve a cookie value', () => {
      document.cookie = 'testCookie=testValue; path=/';
      const value = getCookie('testCookie');
      expect(value).toBe('testValue');
    });

    it('should decode URL encoded cookie values', () => {
      document.cookie = 'testCookie=value%20with%20spaces; path=/';
      const value = getCookie('testCookie');
      expect(value).toBe('value with spaces');
    });

    it('should return null for non-existent cookie', () => {
      const value = getCookie('nonExistentCookie');
      expect(value).toBeNull();
    });

    it('should handle cookies with spaces around semicolons', () => {
      // Set cookies individually to ensure proper parsing
      setCookie('cookie1', 'value1');
      setCookie('cookie2', 'value2');
      setCookie('cookie3', 'value3');
      expect(getCookie('cookie1')).toBe('value1');
      expect(getCookie('cookie2')).toBe('value2');
      expect(getCookie('cookie3')).toBe('value3');
    });

    it('should return null in SSR environment (no window)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally removing window for SSR test
      delete global.window;

      const value = getCookie('testCookie');
      expect(value).toBeNull();

      global.window = originalWindow;
    });

    it('should handle empty cookie string', () => {
      document.cookie = '';
      const value = getCookie('testCookie');
      expect(value).toBeNull();
    });

    it('should handle cookie name that is prefix of another cookie', () => {
      // Set cookies individually to ensure proper parsing
      setCookie('test', 'value1');
      setCookie('testCookie', 'value2');
      expect(getCookie('test')).toBe('value1');
      expect(getCookie('testCookie')).toBe('value2');
    });
  });

  describe('hasConsent', () => {
    it('should return true when cookieConsent cookie exists', () => {
      setCookie('cookieConsent', 'accepted');
      expect(hasConsent()).toBe(true);
    });

    it('should return false when cookieConsent cookie does not exist', () => {
      expect(hasConsent()).toBe(false);
    });

    it('should return true for any consent status', () => {
      setCookie('cookieConsent', 'accepted');
      expect(hasConsent()).toBe(true);

      setCookie('cookieConsent', 'declined');
      expect(hasConsent()).toBe(true);

      setCookie('cookieConsent', 'customized');
      expect(hasConsent()).toBe(true);
    });
  });

  describe('getCookiePreferences', () => {
    it('should return parsed cookie preferences', () => {
      const preferences: CookiePreferences = {
        necessary: true,
        analytics: true,
      };
      setCookie('cookiePreferences', JSON.stringify(preferences));

      const result = getCookiePreferences();
      expect(result).toEqual(preferences);
    });

    it('should return null when cookie does not exist', () => {
      const result = getCookiePreferences();
      expect(result).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      setCookie('cookiePreferences', 'invalid json{');
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = getCookiePreferences();

      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to parse saved cookie preferences'
      );

      consoleSpy.mockRestore();
    });

    it('should handle preferences with analytics disabled', () => {
      const preferences: CookiePreferences = {
        necessary: true,
        analytics: false,
      };
      setCookie('cookiePreferences', JSON.stringify(preferences));

      const result = getCookiePreferences();
      expect(result).toEqual(preferences);
    });

    it('should handle empty JSON object', () => {
      setCookie('cookiePreferences', '{}');
      const result = getCookiePreferences();
      expect(result).toEqual({});
    });
  });

  describe('saveCookieConsent', () => {
    it('should save consent status and preferences', () => {
      const preferences: CookiePreferences = {
        necessary: true,
        analytics: true,
      };

      saveCookieConsent('accepted', preferences);

      expect(getCookie('cookieConsent')).toBe('accepted');
      expect(getCookiePreferences()).toEqual(preferences);
    });

    it('should save with 10 year expiration', () => {
      const preferences: CookiePreferences = {
        necessary: true,
        analytics: false,
      };

      saveCookieConsent('declined', preferences);

      const consentCookie = document.cookie;
      expect(consentCookie).toContain('cookieConsent=declined');
      expect(consentCookie).toContain('cookiePreferences=');
    });

    it('should handle customized consent status', () => {
      const preferences: CookiePreferences = {
        necessary: true,
        analytics: true,
      };

      saveCookieConsent('customized', preferences);

      expect(getCookie('cookieConsent')).toBe('customized');
      expect(getCookiePreferences()).toEqual(preferences);
    });

    it('should overwrite existing consent', () => {
      const initialPreferences: CookiePreferences = {
        necessary: true,
        analytics: false,
      };
      saveCookieConsent('declined', initialPreferences);

      const newPreferences: CookiePreferences = {
        necessary: true,
        analytics: true,
      };
      saveCookieConsent('accepted', newPreferences);

      expect(getCookie('cookieConsent')).toBe('accepted');
      expect(getCookiePreferences()).toEqual(newPreferences);
    });

    it('should properly encode JSON in cookie', () => {
      const preferences: CookiePreferences = {
        necessary: true,
        analytics: true,
      };

      saveCookieConsent('accepted', preferences);

      const cookieValue = getCookie('cookiePreferences');
      expect(cookieValue).toBeTruthy();
      const parsed = JSON.parse(cookieValue!);
      expect(parsed).toEqual(preferences);
    });
  });
});

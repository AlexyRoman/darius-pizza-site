/**
 * Unit tests for analytics utility functions
 */

// Mock cookie-utils module BEFORE importing analytics
jest.mock('../cookie-utils', () => ({
  getCookiePreferences: jest.fn(),
}));

// Import after mock
import { trackPageView, enableAnalytics, disableAnalytics } from '../analytics';
import * as cookieUtils from '../cookie-utils';

describe('analytics', () => {
  let mockGtag: jest.Mock;
  let mockDataLayer: unknown[];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockDataLayer = [];
    mockGtag = jest.fn((...args: unknown[]) => {
      mockDataLayer.push(args);
    });

    // Setup window object
    Object.defineProperty(window, 'gtag', {
      writable: true,
      value: mockGtag,
    });

    Object.defineProperty(window, 'dataLayer', {
      writable: true,
      value: mockDataLayer,
    });

    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        href: 'https://example.com/test',
        hostname: 'example.com',
      },
    });

    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0',
    });

    // Default mock for cookie preferences
    (cookieUtils.getCookiePreferences as jest.Mock).mockReturnValue({
      analytics: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('trackPageView', () => {
    it('should track page view when analytics is enabled', () => {
      (cookieUtils.getCookiePreferences as jest.Mock).mockReturnValue({
        analytics: true,
      });

      trackPageView('/test-page', 'Test Page');

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/test-page',
        page_title: 'Test Page',
      });
    });

    it('should track page view without title', () => {
      (cookieUtils.getCookiePreferences as jest.Mock).mockReturnValue({
        analytics: true,
      });

      trackPageView('/test-page');

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/test-page',
        page_title: undefined,
      });
    });

    it('should not track when analytics is disabled', () => {
      (cookieUtils.getCookiePreferences as jest.Mock).mockReturnValue({
        analytics: false,
      });

      trackPageView('/test-page', 'Test Page');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should not track when preferences are null', () => {
      (cookieUtils.getCookiePreferences as jest.Mock).mockReturnValue(null);

      trackPageView('/test-page', 'Test Page');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should not track when preferences are undefined', () => {
      (cookieUtils.getCookiePreferences as jest.Mock).mockReturnValue(
        undefined
      );

      trackPageView('/test-page', 'Test Page');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('should not track in SSR environment (no window)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally removing window for SSR test
      delete global.window;

      trackPageView('/test-page', 'Test Page');

      expect(mockGtag).not.toHaveBeenCalled();

      global.window = originalWindow;
    });

    it('should not track when gtag is not available', () => {
      // Clear previous calls
      mockGtag.mockClear();
      (cookieUtils.getCookiePreferences as jest.Mock).mockClear();

      // Save original and set gtag to undefined
      const originalGtag = window.gtag;
      // @ts-expect-error - intentionally setting to undefined
      window.gtag = undefined;

      // Track should return early before calling gtag
      trackPageView('/test-page', 'Test Page');

      // Restore gtag for other tests
      window.gtag = originalGtag;

      // Verify gtag was not called (function returns early due to !window.gtag check)
      expect(mockGtag).not.toHaveBeenCalled();
      // Also verify getCookiePreferences was not called (early return happens before it)
      expect(cookieUtils.getCookiePreferences).not.toHaveBeenCalled();
    });
  });

  describe('enableAnalytics', () => {
    it('should update consent to granted', () => {
      enableAnalytics();

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    });

    it('should handle missing gtag gracefully when window exists', () => {
      const originalGtag = window.gtag;
      // @ts-expect-error - intentionally setting to undefined
      window.gtag = undefined;

      // enableAnalytics should call updateConsent, which checks for gtag
      // This tests the !window.gtag branch in updateConsent
      enableAnalytics();

      // gtag should not be called because updateConsent returns early
      expect(mockGtag).not.toHaveBeenCalled();

      window.gtag = originalGtag;
    });

    // Note: Debug logging is tested indirectly via integration
    // Since DEBUG is evaluated at module load time, testing it requires module reload
    // which is complex and not worth the effort for this utility function

    it('should not throw error in SSR environment (no window)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally removing window for SSR test
      delete global.window;

      expect(() => enableAnalytics()).not.toThrow();

      global.window = originalWindow;
    });

    it('should handle missing gtag gracefully', () => {
      // @ts-expect-error - intentionally removing gtag
      delete window.gtag;

      expect(() => enableAnalytics()).not.toThrow();
    });
  });

  describe('disableAnalytics', () => {
    it('should update consent to denied', () => {
      disableAnalytics();

      expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    });

    // Note: Debug logging is tested indirectly via integration
    // Since DEBUG is evaluated at module load time, testing it requires module reload

    it('should handle missing gtag gracefully when window exists', () => {
      const originalGtag = window.gtag;
      // @ts-expect-error - intentionally setting to undefined
      window.gtag = undefined;

      // disableAnalytics should call updateConsent, which checks for gtag
      // This tests the !window.gtag branch in updateConsent
      disableAnalytics();

      // gtag should not be called because updateConsent returns early
      expect(mockGtag).not.toHaveBeenCalled();

      window.gtag = originalGtag;
    });

    it('should not throw error in SSR environment (no window)', () => {
      const originalWindow = global.window;
      // @ts-expect-error - intentionally removing window for SSR test
      delete global.window;

      expect(() => disableAnalytics()).not.toThrow();

      global.window = originalWindow;
    });

    it('should handle missing gtag gracefully', () => {
      // @ts-expect-error - intentionally removing gtag
      delete window.gtag;

      expect(() => disableAnalytics()).not.toThrow();
    });
  });
});

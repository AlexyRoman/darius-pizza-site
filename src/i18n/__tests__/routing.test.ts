/**
 * Tests for i18n routing configuration
 *
 * These tests verify that routing configuration correctly:
 * - Generates pathnames from centralized PAGES configuration
 * - Uses correct locale settings
 * - Maintains proper structure for next-intl
 */

// Mock locales-config before importing
jest.mock('@/config/generic/locales-config', () => ({
  getEnabledLocaleCodes: jest.fn(() => ['en', 'fr', 'de']),
  getDefaultLocale: jest.fn(() => 'fr'),
  getLocaleSettings: jest.fn(() => ({
    localePrefix: 'always',
    localeDetection: true,
  })),
}));

// Mock pages config
jest.mock('@/config/site/pages', () => ({
  PAGES: {
    home: {
      path: '/',
      sitemapPriority: 1.0,
      sitemapChangeFrequency: 'daily',
      sitemapEnabled: true,
    },
    menu: {
      path: '/menu',
      sitemapPriority: 0.8,
      sitemapChangeFrequency: 'weekly',
      sitemapEnabled: true,
    },
    info: {
      path: '/info',
      sitemapPriority: 0.5,
      sitemapChangeFrequency: 'yearly',
      sitemapEnabled: true,
    },
    privacy: {
      path: '/privacy',
      sitemapPriority: 0.3,
      sitemapChangeFrequency: 'yearly',
      sitemapEnabled: true,
    },
    cookies: {
      path: '/cookies',
      sitemapPriority: 0.3,
      sitemapChangeFrequency: 'yearly',
      sitemapEnabled: true,
    },
    legalMentions: {
      path: '/legal-mentions',
      sitemapPriority: 0.3,
      sitemapChangeFrequency: 'yearly',
      sitemapEnabled: true,
    },
  },
}));

// Mock next-intl/routing
jest.mock('next-intl/routing', () => ({
  defineRouting: jest.fn(config => config),
}));

import { routing } from '../routing';
import { PAGES } from '@/config/site/pages';

describe('i18n/routing', () => {
  describe('routing configuration', () => {
    it('should have correct structure', () => {
      expect(routing).toBeDefined();
      expect(routing).toHaveProperty('locales');
      expect(routing).toHaveProperty('defaultLocale');
      expect(routing).toHaveProperty('localePrefix');
      expect(routing).toHaveProperty('localeDetection');
      expect(routing).toHaveProperty('pathnames');
    });

    it('should use getEnabledLocaleCodes for locales', () => {
      // Verify the result matches expected values from mocked function
      expect(routing.locales).toEqual(['en', 'fr', 'de']);
      expect(Array.isArray(routing.locales)).toBe(true);
      expect(routing.locales.length).toBeGreaterThan(0);
    });

    it('should use getDefaultLocale for defaultLocale', () => {
      // Verify the result matches expected value from mocked function
      expect(routing.defaultLocale).toBe('fr');
      expect(typeof routing.defaultLocale).toBe('string');
    });

    it('should use getLocaleSettings for locale settings', () => {
      // Verify the result matches expected values from mocked function
      expect(routing.localePrefix).toBe('always');
      expect(routing.localeDetection).toBe(true);
      expect(typeof routing.localePrefix).toBe('string');
      expect(typeof routing.localeDetection).toBe('boolean');
    });
  });

  describe('pathnames generation', () => {
    it('should generate pathnames from PAGES configuration', () => {
      const expectedPathnames = {
        '/': '/',
        '/menu': '/menu',
        '/info': '/info',
        '/privacy': '/privacy',
        '/cookies': '/cookies',
        '/legal-mentions': '/legal-mentions',
      };

      expect(routing.pathnames).toEqual(expectedPathnames);
    });

    it('should include all pages from PAGES configuration', () => {
      const pagePaths = Object.values(PAGES).map(page => page.path);
      const pathnameKeys = Object.keys(routing.pathnames);

      expect(pathnameKeys).toHaveLength(pagePaths.length);
      pagePaths.forEach(path => {
        expect(pathnameKeys).toContain(path);
      });
    });

    it('should map each path to itself (self-reference for i18n)', () => {
      Object.entries(routing.pathnames).forEach(([key, value]) => {
        expect(key).toBe(value);
      });
    });

    it('should include home page', () => {
      expect(routing.pathnames).toHaveProperty('/');
      expect(routing.pathnames['/']).toBe('/');
    });

    it('should include menu page', () => {
      expect(routing.pathnames).toHaveProperty('/menu');
      expect(routing.pathnames['/menu']).toBe('/menu');
    });

    it('should include info page', () => {
      expect(routing.pathnames).toHaveProperty('/info');
      expect(routing.pathnames['/info']).toBe('/info');
    });

    it('should include privacy page', () => {
      expect(routing.pathnames).toHaveProperty('/privacy');
      expect(routing.pathnames['/privacy']).toBe('/privacy');
    });

    it('should include cookies page', () => {
      expect(routing.pathnames).toHaveProperty('/cookies');
      expect(routing.pathnames['/cookies']).toBe('/cookies');
    });

    it('should include legal-mentions page', () => {
      expect(routing.pathnames).toHaveProperty('/legal-mentions');
      expect(routing.pathnames['/legal-mentions']).toBe('/legal-mentions');
    });
  });

  describe('pathnames consistency', () => {
    it('should have no duplicate paths', () => {
      const paths = Object.keys(routing.pathnames);
      const uniquePaths = new Set(paths);
      expect(paths.length).toBe(uniquePaths.size);
    });

    it('should match PAGES configuration exactly', () => {
      const pagesPaths = Object.values(PAGES).map(p => p.path);
      const routingPaths = Object.keys(routing.pathnames);

      expect(routingPaths.sort()).toEqual(pagesPaths.sort());
    });
  });

  describe('integration with PAGES', () => {
    it('should dynamically reflect changes in PAGES', () => {
      // This test ensures that if PAGES changes, pathnames should reflect it
      const allPagePaths = Object.values(PAGES).map(page => page.path);
      const pathnameKeys = Object.keys(routing.pathnames);

      // Verify all pages are represented
      allPagePaths.forEach(path => {
        expect(pathnameKeys).toContain(path);
        expect(routing.pathnames[path]).toBe(path);
      });
    });

    it('should maintain type safety with pathnames', () => {
      // Verify pathnames is a Record<string, string>
      expect(typeof routing.pathnames).toBe('object');
      expect(routing.pathnames).not.toBeNull();
      expect(Array.isArray(routing.pathnames)).toBe(false);

      // Verify all values are strings
      Object.values(routing.pathnames).forEach(value => {
        expect(typeof value).toBe('string');
      });
    });
  });
});

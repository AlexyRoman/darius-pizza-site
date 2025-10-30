/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
import * as middlewareConfig from '@/config/middleware';

// Use a global variable that can be accessed from the hoisted mock
declare global {
  // eslint-disable-next-line no-var
  var mockIntlMiddlewareFunction: jest.Mock | undefined;
}

// Mock next-intl/middleware - this must be hoisted
jest.mock('next-intl/middleware', () => {
  const mockFn = jest.fn();
  // Store reference to the mock function in global scope
  global.mockIntlMiddlewareFunction = mockFn;
  return {
    __esModule: true,
    default: jest.fn(() => mockFn),
  };
});

// Mock locales config
jest.mock('@/config/locales-config', () => ({
  getLocaleSettings: jest.fn(() => ({
    localeDetection: true,
    localePrefix: 'always',
  })),
}));

// Mock routing
jest.mock('@/i18n/routing', () => ({
  routing: {
    locales: ['en', 'fr', 'de', 'it', 'es', 'nl'],
    defaultLocale: 'en',
  },
}));

// Import middleware after mocks are set up
import middleware from '@/middleware';

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to create a NextRequest mock
  function createRequest(pathname: string, baseUrl = 'https://example.com'): NextRequest {
    const url = new URL(pathname, baseUrl);
    return {
      nextUrl: url,
      url: url.toString(),
    } as NextRequest;
  }

  describe('Static path handling', () => {
    it('should skip middleware for /api paths', () => {
      const request = createRequest('/api/test');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      expect((response as NextResponse).status).toBe(200);
    });

    it('should skip middleware for /_next paths', () => {
      const request = createRequest('/_next/static/chunks/main.js');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for /static paths', () => {
      const request = createRequest('/static/image.jpg');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for /images paths', () => {
      const request = createRequest('/images/logo.png');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for /flags paths', () => {
      const request = createRequest('/flags/en.svg');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for /fonts paths', () => {
      const request = createRequest('/fonts/inter.woff2');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.ico)', () => {
      const request = createRequest('/favicon.ico');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.png)', () => {
      const request = createRequest('/some-image.png');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.jpg)', () => {
      const request = createRequest('/photo.jpg');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.jpeg)', () => {
      const request = createRequest('/photo.jpeg');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.svg)', () => {
      const request = createRequest('/icon.svg');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.webp)', () => {
      const request = createRequest('/image.webp');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for locale-prefixed static paths', () => {
      const request = createRequest('/fr/_next/static/chunks/main.js');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for locale-prefixed static file paths', () => {
      const request = createRequest('/en/static/hero.webp');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for locale-prefixed API paths', () => {
      const request = createRequest('/de/api/test');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for locale-prefixed images paths', () => {
      const request = createRequest('/it/images/logo.png');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });
  });

  describe('Legacy redirect handling', () => {
    it('should redirect /carte to /menu', () => {
      const request = createRequest('/carte');
      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
      expect(nextResponse.headers.get('location')).toBe('https://example.com/menu');
    });

    it('should redirect /gallery to /', () => {
      const request = createRequest('/gallery');
      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should redirect /contact to /', () => {
      const request = createRequest('/contact');
      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should redirect /rs to /', () => {
      const request = createRequest('/rs');
      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should redirect /horaires to /', () => {
      const request = createRequest('/horaires');
      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should redirect /terms to /', () => {
      const request = createRequest('/terms');
      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should not redirect paths not in redirect mappings', () => {
      const request = createRequest('/some-path');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });
  });

  describe('Locale handling', () => {
    it('should pass non-static, non-redirect paths to next-intl middleware', () => {
      const request = createRequest('/');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalledWith(request);
      expect(response).toBe(mockIntlResponse);
    });

    it('should pass localized paths to next-intl middleware', () => {
      const request = createRequest('/fr/menu');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalledWith(request);
      expect(response).toBe(mockIntlResponse);
    });

    it('should pass non-localized paths to next-intl middleware', () => {
      const request = createRequest('/menu');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalledWith(request);
      expect(response).toBe(mockIntlResponse);
    });
  });

  describe('Temporary to permanent redirect conversion', () => {
    it('should convert 307 redirects to 301 for SEO', () => {
      const request = createRequest('/');
      const tempRedirect = NextResponse.redirect(
        new URL('/fr', request.url),
        middlewareConfig.TEMPORARY_REDIRECT_STATUS
      );
      global.mockIntlMiddlewareFunction!.mockReturnValue(tempRedirect);

      const response = middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
      expect(nextResponse.headers.get('location')).toBe('https://example.com/fr');
    });

    it('should not convert non-307 redirects', () => {
      const request = createRequest('/');
      const redirect302 = NextResponse.redirect(
        new URL('/fr', request.url),
        302
      );
      global.mockIntlMiddlewareFunction!.mockReturnValue(redirect302);

      const response = middleware(request);

      expect(response).toBe(redirect302);
      expect(redirect302.status).toBe(302);
    });

    it('should not convert responses without location header', () => {
      const request = createRequest('/');
      const responseWithoutLocation = new NextResponse(null, {
        status: middlewareConfig.TEMPORARY_REDIRECT_STATUS,
      });
      global.mockIntlMiddlewareFunction!.mockReturnValue(responseWithoutLocation);

      const response = middleware(request);

      expect(response).toBe(responseWithoutLocation);
    });

    it('should not convert non-redirect responses', () => {
      const request = createRequest('/');
      const normalResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(normalResponse);

      const response = middleware(request);

      expect(response).toBe(normalResponse);
      expect(normalResponse.status).toBe(200);
    });
  });

  describe('Edge cases', () => {
    it('should handle root path', () => {
      const request = createRequest('/');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });

    it('should handle paths with query parameters', () => {
      const request = createRequest('/menu?param=value');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });

    it('should handle paths with hash', () => {
      const request = createRequest('/menu#section');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });

    it('should handle unknown locale prefixes as regular paths', () => {
      const request = createRequest('/unknown-locale/page');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });

    it('should handle locale-only paths', () => {
      const request = createRequest('/fr');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete flow: static path with locale prefix', () => {
      const request = createRequest('/en/static/image.webp');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should handle complete flow: legacy redirect then locale handling', () => {
      // Note: Legacy redirects happen before locale handling
      const request = createRequest('/carte');
      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
    });

    it('should handle complete flow: regular path with locale redirect conversion', () => {
      const request = createRequest('/');
      const tempRedirect = NextResponse.redirect(
        new URL('/en', request.url),
        middlewareConfig.TEMPORARY_REDIRECT_STATUS
      );
      global.mockIntlMiddlewareFunction!.mockReturnValue(tempRedirect);

      const response = middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(middlewareConfig.PERMANENT_REDIRECT_STATUS);
    });
  });
});

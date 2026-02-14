/**
 * @jest-environment node
 */
import { NextRequest, NextResponse } from 'next/server';
import * as genericMiddlewareConfig from '@/config/generic/middleware';

// Use a global variable that can be accessed from the hoisted mock
declare global {
  var mockIntlMiddlewareFunction: jest.Mock | undefined;
}

// Mock next-intl/middleware - this must be hoisted (sync factory so default is a function)
jest.mock('next-intl/middleware', () => {
  const mockFn = jest.fn();
  global.mockIntlMiddlewareFunction = mockFn;
  return {
    __esModule: true,
    default: jest.fn(() => mockFn),
  };
});

// Mock locales config
jest.mock('@/config/generic/locales-config', () => ({
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

// Mock qr-analytics so middleware does not call Redis
jest.mock('@/lib/qr-analytics', () => ({
  recordQrHit: jest.fn().mockResolvedValue(undefined),
  isValidQrCode: jest.fn((code: string) => /^[A-Za-z0-9]{4}$/.test(code)),
}));

// Import middleware after mocks are set up
import middleware from '@/middleware';

describe('Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to create a NextRequest mock
  function createRequest(
    pathname: string,
    baseUrl = 'https://example.com'
  ): NextRequest {
    const url = new URL(pathname, baseUrl);
    return {
      nextUrl: url,
      url: url.toString(),
    } as NextRequest;
  }

  describe('Static path handling', () => {
    it('should skip middleware for /api paths', async () => {
      const request = createRequest('/api/test');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      expect((response as NextResponse).status).toBe(200);
    });

    it('should skip middleware for /_next paths', async () => {
      const request = createRequest('/_next/static/chunks/main.js');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for /static paths', async () => {
      const request = createRequest('/static/image.jpg');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for /images paths', async () => {
      const request = createRequest('/images/logo.png');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for /flags paths', async () => {
      const request = createRequest('/flags/en.svg');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for /fonts paths', async () => {
      const request = createRequest('/fonts/inter.woff2');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.ico)', async () => {
      const request = createRequest('/favicon.ico');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.png)', async () => {
      const request = createRequest('/some-image.png');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.jpg)', async () => {
      const request = createRequest('/photo.jpg');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.jpeg)', async () => {
      const request = createRequest('/photo.jpeg');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.svg)', async () => {
      const request = createRequest('/icon.svg');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for static file extensions (.webp)', async () => {
      const request = createRequest('/image.webp');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for locale-prefixed static paths', async () => {
      const request = createRequest('/fr/_next/static/chunks/main.js');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for locale-prefixed static file paths', async () => {
      const request = createRequest('/en/static/hero.webp');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for locale-prefixed API paths', async () => {
      const request = createRequest('/de/api/test');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should skip middleware for locale-prefixed images paths', async () => {
      const request = createRequest('/it/images/logo.png');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });
  });

  describe('Legacy redirect handling', () => {
    it('should redirect /carte to /menu', async () => {
      const request = createRequest('/carte');
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
      expect(nextResponse.headers.get('location')).toBe(
        'https://example.com/menu'
      );
    });

    it('should redirect /gallery to /', async () => {
      const request = createRequest('/gallery');
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should redirect /contact to /', async () => {
      const request = createRequest('/contact');
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should redirect /rs to /', async () => {
      const request = createRequest('/rs');
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should redirect /horaires to /', async () => {
      const request = createRequest('/horaires');
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should redirect /terms to /', async () => {
      const request = createRequest('/terms');
      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
      expect(nextResponse.headers.get('location')).toBe('https://example.com/');
    });

    it('should not redirect paths not in redirect mappings', async () => {
      const request = createRequest('/some-path');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });
  });

  describe('Locale handling', () => {
    it('should pass non-static, non-redirect paths to next-intl middleware', async () => {
      const request = createRequest('/');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalledWith(request);
      expect(response).toBe(mockIntlResponse);
    });

    it('should pass localized paths to next-intl middleware', async () => {
      const request = createRequest('/fr/menu');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalledWith(request);
      expect(response).toBe(mockIntlResponse);
    });

    it('should pass non-localized paths to next-intl middleware', async () => {
      const request = createRequest('/menu');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalledWith(request);
      expect(response).toBe(mockIntlResponse);
    });
  });

  describe('Temporary to permanent redirect conversion', () => {
    it('should convert 307 redirects to 301 for SEO', async () => {
      const request = createRequest('/');
      const tempRedirect = NextResponse.redirect(
        new URL('/fr', request.url),
        genericMiddlewareConfig.TEMPORARY_REDIRECT_STATUS
      );
      global.mockIntlMiddlewareFunction!.mockReturnValue(tempRedirect);

      const response = await middleware(request);

      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
      expect(nextResponse.headers.get('location')).toBe(
        'https://example.com/fr'
      );
    });

    it('should not convert non-307 redirects', async () => {
      const request = createRequest('/');
      const redirect302 = NextResponse.redirect(
        new URL('/fr', request.url),
        302
      );
      global.mockIntlMiddlewareFunction!.mockReturnValue(redirect302);

      const response = await middleware(request);

      expect(response).toBe(redirect302);
      expect(redirect302.status).toBe(302);
    });

    it('should not convert responses without location header', async () => {
      const request = createRequest('/');
      const responseWithoutLocation = new NextResponse(null, {
        status: genericMiddlewareConfig.TEMPORARY_REDIRECT_STATUS,
      });
      global.mockIntlMiddlewareFunction!.mockReturnValue(
        responseWithoutLocation
      );

      const response = await middleware(request);

      expect(response).toBe(responseWithoutLocation);
    });

    it('should not convert non-redirect responses', async () => {
      const request = createRequest('/');
      const normalResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(normalResponse);

      const response = await middleware(request);

      expect(response).toBe(normalResponse);
      expect(normalResponse.status).toBe(200);
    });
  });

  describe('Edge cases', () => {
    it('should handle root path', async () => {
      const request = createRequest('/');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });

    it('should handle paths with query parameters', async () => {
      const request = createRequest('/menu?param=value');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });

    it('should handle paths with hash', async () => {
      const request = createRequest('/menu#section');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });

    it('should handle unknown locale prefixes as regular paths', async () => {
      const request = createRequest('/unknown-locale/page');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });

    it('should handle locale-only paths', async () => {
      const request = createRequest('/fr');
      const mockIntlResponse = NextResponse.next();
      global.mockIntlMiddlewareFunction!.mockReturnValue(mockIntlResponse);

      await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete flow: static path with locale prefix', async () => {
      const request = createRequest('/en/static/image.webp');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
    });

    it('should handle complete flow: legacy redirect then locale handling', async () => {
      // Note: Legacy redirects happen before locale handling
      const request = createRequest('/carte');
      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).not.toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
    });

    it('should handle complete flow: regular path with locale redirect conversion', async () => {
      const request = createRequest('/');
      const tempRedirect = NextResponse.redirect(
        new URL('/en', request.url),
        genericMiddlewareConfig.TEMPORARY_REDIRECT_STATUS
      );
      global.mockIntlMiddlewareFunction!.mockReturnValue(tempRedirect);

      const response = await middleware(request);

      expect(global.mockIntlMiddlewareFunction!).toHaveBeenCalled();
      expect(response).toBeInstanceOf(NextResponse);
      const nextResponse = response as NextResponse;
      expect(nextResponse.status).toBe(
        genericMiddlewareConfig.PERMANENT_REDIRECT_STATUS
      );
    });
  });
});

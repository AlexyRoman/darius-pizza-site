import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { routing } from '@/i18n/routing';
import { isRouteProtected } from '@/config/site/protected-routes';
import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';
import { getLocaleSettings } from '@/config/generic/locales-config';
import {
  STATIC_PATH_PREFIXES,
  STATIC_FILE_EXTENSIONS,
  STATIC_FILE_PATTERN,
  PERMANENT_REDIRECT_STATUS,
  TEMPORARY_REDIRECT_STATUS,
  CONVERT_TEMPORARY_TO_PERMANENT,
} from '@/config/generic/middleware';
import { REDIRECT_MAPPINGS } from '@/config/site/redirects';

const localeSettings = getLocaleSettings();

const intl = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: localeSettings.localeDetection,
  localePrefix: localeSettings.localePrefix,
});

/**
 * Checks if a pathname should be excluded from middleware redirect logic
 *
 * Handles both:
 * - Direct static paths: /_next/..., /static/..., /api/...
 * - Locale-prefixed static paths: /fr/_next/..., /en/static/...
 */
function isStaticPath(pathname: string): boolean {
  // Check for static file extensions (matches any path with these extensions)
  if (STATIC_FILE_PATTERN.test(pathname)) {
    return true;
  }

  // Check if path starts with any static prefix directly
  if (STATIC_PATH_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return true;
  }

  // Check if path has a locale prefix followed by a static prefix
  // Example: /fr/_next/... or /en/static/...
  const pathSegments = pathname.split('/').filter(Boolean);

  // If path has at least 2 segments, check if second segment is a static prefix
  // This handles cases like /fr/_next/... where 'fr' is locale and '_next' is static
  if (pathSegments.length >= 2) {
    const secondSegment = `/${pathSegments[1]}`;
    // Check if this segment matches any static prefix (without trailing slash for matching)
    if (
      STATIC_PATH_PREFIXES.some(
        prefix =>
          secondSegment === prefix || secondSegment.startsWith(`${prefix}/`)
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Handles legacy URL redirects defined in config
 */
function handleLegacyRedirects(
  pathname: string,
  request: NextRequest
): NextResponse | null {
  const redirectPath = REDIRECT_MAPPINGS[pathname];
  if (redirectPath) {
    return NextResponse.redirect(
      new URL(redirectPath, request.url),
      PERMANENT_REDIRECT_STATUS
    );
  }
  return null;
}

/**
 * Converts temporary redirects (307) to permanent redirects (301) for SEO
 * This ensures locale prefix redirects are permanent (e.g., / -> /fr, /menu -> /fr/menu)
 */
function convertToPermanentRedirect(
  response: NextResponse
): NextResponse | null {
  if (
    !CONVERT_TEMPORARY_TO_PERMANENT ||
    response.status !== TEMPORARY_REDIRECT_STATUS
  ) {
    return null;
  }

  const location = response.headers.get('location');
  if (location) {
    return NextResponse.redirect(location, PERMANENT_REDIRECT_STATUS);
  }

  return null;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware entirely for static files and Next.js internal routes
  // These should be served directly by Next.js without any processing
  // We need to strip locale prefix first to check properly
  const pathSegments = pathname.split('/').filter(Boolean);
  const possibleLocale = pathSegments[0];
  const isKnownLocale = routing.locales.includes(possibleLocale as string);

  // Extract path without locale prefix for checking
  const pathWithoutLocale =
    isKnownLocale && pathSegments.length > 1
      ? '/' + pathSegments.slice(1).join('/')
      : pathname;

  // Special-case: always serve the web app manifest from root without locale
  if (pathWithoutLocale === '/site.webmanifest') {
    return NextResponse.rewrite(new URL('/site.webmanifest', request.url));
  }

  // Special-case: serve robots.txt and sitemap.xml from root without locale
  if (pathWithoutLocale === '/robots.txt') {
    return NextResponse.rewrite(new URL('/robots.txt', request.url));
  }
  if (pathWithoutLocale === '/sitemap.xml') {
    return NextResponse.rewrite(new URL('/sitemap.xml', request.url));
  }

  // Check if the path (with or without locale) is static
  if (isStaticPath(pathname) || isStaticPath(pathWithoutLocale)) {
    // For static paths, return NextResponse.next() to skip middleware processing
    // This allows Next.js to serve the files directly without locale processing
    return NextResponse.next();
  }

  // Handle legacy URL redirects (before locale prefix is applied)
  const legacyRedirect = handleLegacyRedirects(pathname, request);
  if (legacyRedirect) {
    return legacyRedirect;
  }

  // Apply next-intl middleware for locale handling
  const response = intl(request);

  // If intl issued a redirect, return it (after optional conversion below)
  if (response instanceof NextResponse && response.headers.get('Location')) {
    const permanentRedirect = convertToPermanentRedirect(response);
    if (permanentRedirect) return permanentRedirect;
    return response;
  }

  // Protected route check: rewrite to auth-gate if not authenticated
  if (isRouteProtected(pathWithoutLocale)) {
    const token = request.cookies.get(AUTH_COOKIE_NAME);
    if (!token || token.value !== 'authenticated') {
      const locale = isKnownLocale ? possibleLocale : routing.defaultLocale;
      const redirectUrl = `/${locale}/auth-gate?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.rewrite(new URL(redirectUrl, request.url));
    }
  }

  // Set locale cookie and header for RootLayout to read html[lang]
  if (response instanceof NextResponse) {
    if (isKnownLocale) {
      response.cookies.set('NEXT_LOCALE', possibleLocale, { path: '/' });
      response.headers.set('x-locale', possibleLocale);
    } else {
      // Default locale for root paths
      response.headers.set('x-locale', routing.defaultLocale);
    }

    // Convert temporary redirects to permanent for SEO benefits
    const permanentRedirect = convertToPermanentRedirect(response);
    if (permanentRedirect) {
      return permanentRedirect;
    }
  }

  return response;
}

// Matcher pattern excludes static paths and file extensions
//
// ⚠️ IMPORTANT: Next.js requires this to be a static string literal (no function calls, no template literals)
// This pattern must be manually kept in sync with STATIC_PATH_PREFIXES and STATIC_FILE_EXTENSIONS
// in src/config/middleware.ts
//
// Current static paths from config: api, _next, static, images, flags, fonts
// Current file extensions from config: ico, png, jpg, jpeg, svg, webp
//
// Pattern: exclude paths starting with static prefixes OR ending with file extensions
// Note: Uses non-capturing groups (?:) to avoid Next.js errors
export const config = {
  matcher: [
    '/((?!api|_next|static|images|flags|fonts|_vercel|[\\w-]+\\.(?:ico|png|jpg|jpeg|svg|webp|webmanifest)$).*)',
  ],
};

/**
 * Validation helper: checks if matcher pattern is in sync with config
 * This runs at module load time and logs a warning if there's a mismatch
 *
 * @internal - for development/debugging only
 */
if (process.env.NODE_ENV === 'development') {
  const configPaths = [...STATIC_PATH_PREFIXES.map(p => p.slice(1))]
    .sort()
    .join(',');
  const configExtensions = [...STATIC_FILE_EXTENSIONS].sort().join(',');

  const expectedPaths = 'api,flags,fonts,images,static,_next'; // sorted
  const expectedExtensions = 'ico,jpeg,jpg,png,svg,webmanifest,webp'; // sorted

  if (configPaths !== expectedPaths) {
    console.warn(
      `[Middleware] Config mismatch: STATIC_PATH_PREFIXES in config (${configPaths}) doesn't match expected (${expectedPaths}). Update matcher pattern!`
    );
  }
  if (configExtensions !== expectedExtensions) {
    console.warn(
      `[Middleware] Config mismatch: STATIC_FILE_EXTENSIONS in config (${configExtensions}) doesn't match expected (${expectedExtensions}). Update matcher pattern!`
    );
  }
}

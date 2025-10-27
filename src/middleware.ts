import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { routing } from '@/i18n/routing';

const intl = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip redirect logic for API, static files, and Next.js internal routes
  const isApiOrStatic =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp)$/);

  if (isApiOrStatic) {
    return intl(request);
  }

  // Redirect old /carte to /menu
  if (pathname === '/carte') {
    return NextResponse.redirect(new URL('/menu', request.url), 301);
  }

  // Redirect specific old pages to home
  const oldPagesToRedirect = ['/gallery', '/contact', '/rs', '/horaires'];
  if (oldPagesToRedirect.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  // Apply next-intl middleware
  return intl(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|static|images|flags|[\\w-]+\\.\\w+).*)'],
};

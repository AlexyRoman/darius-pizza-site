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
  const response = intl(request);

  // Convert temporary redirects (307) to permanent redirects (301) for SEO
  // This is important for locale prefix redirects (e.g., / -> /fr, /menu -> /fr/menu)
  if (
    response instanceof NextResponse &&
    response.status === 307 &&
    response.headers.get('location')
  ) {
    const location = response.headers.get('location');
    if (location) {
      return NextResponse.redirect(location, 301);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|static|images|flags|[\\w-]+\\.\\w+).*)'],
};

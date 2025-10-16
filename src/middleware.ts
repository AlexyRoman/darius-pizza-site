import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';

const intl = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
});

export default intl;

export const config = {
  matcher: ['/((?!api|_next|_vercel|static|images|flags|[\\w-]+\\.\\w+).*)'],
};

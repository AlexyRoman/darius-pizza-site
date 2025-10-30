import { defineRouting } from 'next-intl/routing';

import {
  getEnabledLocaleCodes,
  getDefaultLocale,
  getLocaleSettings,
} from '@/config/generic/locales-config';

const settings = getLocaleSettings();

export const routing = defineRouting({
  locales: getEnabledLocaleCodes() as string[],
  defaultLocale: getDefaultLocale(),
  localePrefix: settings.localePrefix,
  localeDetection: settings.localeDetection,
  // Exclude static assets from i18n routing
  pathnames: {
    '/': '/',
    '/menu': '/menu',
    '/info': '/info',
    '/privacy': '/privacy',
    '/cookies': '/cookies',
    '/legal-mentions': '/legal-mentions',
  },
});

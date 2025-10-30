import { defineRouting } from 'next-intl/routing';

import {
  getEnabledLocaleCodes,
  getDefaultLocale,
  getLocaleSettings,
} from '@/config/generic/locales-config';
import { PAGES } from '@/config/site/pages';

const settings = getLocaleSettings();

// Generate pathnames from centralized page configuration
const pathnames = Object.values(PAGES).reduce(
  (acc, page) => {
    acc[page.path] = page.path;
    return acc;
  },
  {} as Record<string, string>
);

export const routing = defineRouting({
  locales: getEnabledLocaleCodes() as string[],
  defaultLocale: getDefaultLocale(),
  localePrefix: settings.localePrefix,
  localeDetection: settings.localeDetection,
  // Pathnames generated from centralized page configuration
  pathnames,
});

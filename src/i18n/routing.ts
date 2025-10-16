import { defineRouting } from 'next-intl/routing';

import {
  getEnabledLocaleCodes,
  getDefaultLocale,
  getLocaleSettings,
} from '@/config/locales-config';

const settings = getLocaleSettings();

export const routing = defineRouting({
  locales: getEnabledLocaleCodes() as string[],
  defaultLocale: getDefaultLocale(),
  localePrefix: settings.localePrefix,
  localeDetection: settings.localeDetection,
});

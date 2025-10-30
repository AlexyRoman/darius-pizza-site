import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const localePromise =
    requestLocale instanceof Promise
      ? requestLocale
      : Promise.resolve(requestLocale);
  const resolvedLocale = await localePromise;
  const locale = hasLocale(routing.locales, resolvedLocale)
    ? resolvedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`@/locales/${locale}.json`)).default,
  };
});

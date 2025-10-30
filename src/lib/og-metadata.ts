import type { LocaleMetadata } from '@/types/metadata';
import { getLocaleByCode } from '@/config/generic/locales-config';

export function getLocaleMetadata(locale: string): LocaleMetadata {
  const localeData = getLocaleByCode(locale);

  if (localeData) {
    return {
      name: localeData.name,
      flag: localeData.flag,
      nativeName: localeData.nativeName,
    };
  }

  // Fallback to English if locale not found
  const fallback = getLocaleByCode('en');
  return {
    name: fallback?.name || 'English',
    flag: fallback?.flag || '🌐',
    nativeName: fallback?.nativeName || 'English',
  };
}

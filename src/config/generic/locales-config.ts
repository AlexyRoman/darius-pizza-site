import type { Locale, LocalesConfig, LocaleCode } from '@/types/locales';

import localesData from '@/config/site/locales.json';

const config = localesData as LocalesConfig;

export const localesConfig = config;

export const getLocaleByCode = (code: string): Locale | undefined => {
  return config.locales.find(locale => locale.code === code);
};

export const getAvailableLocales = (): Locale[] => {
  return config.locales.filter(locale => locale.enabled);
};

export const getAllLocales = (): Locale[] => {
  return config.locales;
};

export const getEnabledLocaleCodes = (): LocaleCode[] => {
  return config.locales
    .filter(locale => locale.enabled)
    .map(locale => locale.code as LocaleCode);
};

export const getDefaultLocale = (): string => {
  return config.defaultLocale;
};

export const getLocaleSettings = () => {
  return config.settings;
};

export const getLocaleName = (code: string): string => {
  const locale = getLocaleByCode(code);
  return locale?.name || code;
};

export const getLocaleNativeName = (code: string): string => {
  const locale = getLocaleByCode(code);
  return locale?.nativeName || code;
};

export const getLocaleFlag = (code: string): string => {
  const locale = getLocaleByCode(code);
  return locale?.flag || '🌐';
};

export const getLocaleFallback = (code: string): string | null => {
  const locale = getLocaleByCode(code);
  return locale?.fallback || null;
};

export const isLocaleEnabled = (code: string): boolean => {
  const locale = getLocaleByCode(code);
  return locale?.enabled || false;
};

export const getLocaleDirection = (code: string): 'ltr' | 'rtl' => {
  const locale = getLocaleByCode(code);
  return locale?.direction || 'ltr';
};

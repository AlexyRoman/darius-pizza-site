export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  enabled: boolean;
  fallback: string | null;
}

export interface LocaleSettings {
  localeDetection: boolean;
  localePrefix: 'always' | 'as-needed' | 'never';
  pathnames?: Record<string, string>;
}

export interface LocalesConfig {
  defaultLocale: string;
  locales: Locale[];
  settings: LocaleSettings;
}

export type LocaleCode = 'en' | 'fr';

export interface LocaleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFiles: string[];
  invalidFiles: string[];
}

export interface LocaleMessages {
  [key: string]:
    | string
    | number
    | boolean
    | LocaleMessages
    | Array<string | number | boolean | LocaleMessages>;
}



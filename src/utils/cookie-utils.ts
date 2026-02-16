/**
 * Cookie utility functions for GDPR consent management
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

export type ConsentStatus = 'accepted' | 'declined' | 'customized';

/**
 * Cookie names that are strictly necessary (core functionality).
 * They bypass cookie consent: always set/read regardless of banner choice,
 * and must never be cleared or blocked when the user declines analytics.
 */
export const NECESSARY_COOKIE_NAMES: readonly string[] = [
  'qr_counted', // QR campaign dedupe (rate-limit duplicate counts), 1 day
  'authToken', // Dashboard auth
  'cookieConsent',
  'cookiePreferences',
  'NEXT_LOCALE',
] as const;

export function isNecessaryCookie(name: string): boolean {
  return (NECESSARY_COOKIE_NAMES as readonly string[]).includes(name);
}

const COOKIE_EXPIRY_YEARS = 10;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

// Helper to check if we're in browser environment
const isBrowser = (): boolean => typeof window !== 'undefined';

/**
 * Set a cookie with proper encoding and expiration
 */
export const setCookie = (
  name: string,
  value: string,
  days: number = 365
): void => {
  if (!isBrowser()) return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * MILLISECONDS_PER_DAY);

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (!isBrowser()) return null;

  const cookies = document.cookie.split(';');
  const prefix = `${name}=`;

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }

  return null;
};

/**
 * Check if user has given any form of consent
 */
export const hasConsent = (): boolean => {
  return getCookie('cookieConsent') !== null;
};

/**
 * Get saved cookie preferences
 */
export const getCookiePreferences = (): CookiePreferences | null => {
  const preferencesStr = getCookie('cookiePreferences');
  if (!preferencesStr) return null;

  try {
    return JSON.parse(preferencesStr) as CookiePreferences;
  } catch {
    console.warn('Failed to parse saved cookie preferences');
    return null;
  }
};

/**
 * Save cookie consent and preferences
 */
export const saveCookieConsent = (
  status: ConsentStatus,
  preferences: CookiePreferences
): void => {
  const expiryDays = 365 * COOKIE_EXPIRY_YEARS;
  setCookie('cookieConsent', status, expiryDays);
  setCookie('cookiePreferences', JSON.stringify(preferences), expiryDays);
};

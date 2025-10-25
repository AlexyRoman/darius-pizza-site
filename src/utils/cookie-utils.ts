/**
 * Cookie utility functions for GDPR consent management
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
}

export type ConsentStatus = 'accepted' | 'declined' | 'customized';

/**
 * Set a cookie with proper encoding and expiration
 */
export const setCookie = (
  name: string,
  value: string,
  days: number = 365
): void => {
  if (typeof window === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
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
  setCookie('cookieConsent', status, 365 * 10); // 10 years
  setCookie('cookiePreferences', JSON.stringify(preferences), 365 * 10); // 10 years
};

/**
 * Clear all consent cookies
 */
export const clearCookieConsent = (): void => {
  if (typeof window === 'undefined') return;

  document.cookie =
    'cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
  document.cookie =
    'cookiePreferences=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

/**
 * Update analytics consent status
 */
export const updateAnalyticsConsent = (enabled: boolean): void => {
  const preferences = getCookiePreferences();
  if (!preferences) return;

  const updatedPreferences = {
    ...preferences,
    analytics: enabled,
  };

  saveCookieConsent('customized', updatedPreferences);
};

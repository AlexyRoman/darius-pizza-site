'use client';

import { getCookiePreferences } from '@/utils/cookie-utils';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true';

// Helper to check if we're in browser environment
const isBrowser = (): boolean => typeof window !== 'undefined';

// Helper for debug logging
const debugLog = (...args: unknown[]): void => {
  if (DEBUG) console.log('🔍', ...args);
};

// Consent mode configuration
const CONSENT_GRANTED = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
} as const;

const CONSENT_DENIED = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

// Track page view
export const trackPageView = (url: string, title?: string): void => {
  if (!isBrowser() || !window.gtag) return;

  const preferences = getCookiePreferences();
  if (!preferences?.analytics) return;

  // GTM will handle page tracking automatically
  // This is just for custom page views if needed
  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title,
  });
};

// Update consent mode
const updateConsent = (
  consent: typeof CONSENT_GRANTED | typeof CONSENT_DENIED
): void => {
  if (!isBrowser() || !window.gtag) return;
  window.gtag('consent', 'update', consent);
};

// Enable analytics (called when user accepts analytics cookies)
export const enableAnalytics = (): void => {
  if (!isBrowser()) return;

  debugLog('Enabling analytics');
  debugLog('Current URL:', window.location.href);
  debugLog('User Agent:', navigator.userAgent);

  updateConsent(CONSENT_GRANTED);

  debugLog('Analytics consent granted via Consent Mode');
  debugLog('dataLayer:', window.dataLayer);
};

// Disable analytics (called when user declines analytics cookies)
export const disableAnalytics = (): void => {
  if (!isBrowser()) return;

  debugLog('Analytics consent denied via Consent Mode');
  updateConsent(CONSENT_DENIED);
};

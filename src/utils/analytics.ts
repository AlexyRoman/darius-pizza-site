'use client';

import { getCookiePreferences } from '@/utils/cookie-utils';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  // Configure GA with development-friendly settings
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=Lax;Secure',
    // Allow cookies on localhost for development
    cookie_domain: window.location.hostname === 'localhost' ? 'none' : 'auto',
    // Enable debug mode in development
    debug_mode: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true',
  });

  // Log for debugging
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true') {
    console.log('🔍 GA initialized with ID:', measurementId);
    console.log('🔍 Hostname:', window.location.hostname);
  }
};

// Track page view
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const preferences = getCookiePreferences();
  if (!preferences?.analytics) return;

  window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
    page_path: url,
    page_title: title,
  });
};

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, unknown>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const preferences = getCookiePreferences();
  if (!preferences?.analytics) return;

  window.gtag('event', eventName, parameters);
};

// Track conversion events
export const trackConversion = (
  conversionId: string,
  value?: number,
  currency?: string
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const preferences = getCookiePreferences();
  if (!preferences?.analytics) return;

  window.gtag('event', 'conversion', {
    send_to: conversionId,
    value: value,
    currency: currency,
  });
};

// Check if analytics is enabled
export const isAnalyticsEnabled = (): boolean => {
  const preferences = getCookiePreferences();
  return preferences?.analytics === true;
};

// Enable analytics (called when user accepts analytics cookies)
export const enableAnalytics = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Log for debugging
  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true') {
    console.log('🔍 Enabling analytics with ID:', measurementId);
  }

  initGA(measurementId);

  // Track the consent event
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });

    // Log for debugging
    if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true') {
      console.log('🔍 Analytics consent granted');
    }
  }
};

// Disable analytics (called when user declines analytics cookies)
export const disableAnalytics = () => {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
    });
  }
};

import { env } from '@/lib/env';

/**
 * Get the site's timezone
 * @returns The timezone string (e.g., 'Europe/Paris')
 */
export function getSiteTimeZone(): string {
  return env.SITE_TIME_ZONE;
}

/**
 * Get the site's phone number
 * @returns The phone number string
 */
export function getSitePhone(): string {
  return env.SITE_PHONE;
}

/**
 * Format a number as currency based on site configuration
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., '10.50€' or '$10.50')
 */
export function formatCurrency(amount: number): string {
  const currency = env.NEXT_PUBLIC_CURRENCY ?? '€';
  const amountStr = amount.toFixed(2);
  if (currency === '$') {
    return `${currency}${amountStr}`;
  }
  return `${amountStr}${currency}`;
}


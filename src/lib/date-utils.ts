/**
 * Utility functions for locale-aware date and time formatting
 */

/**
 * Formats a date string using the specified locale
 * @param dateString - ISO date string
 * @param locale - Locale code (e.g., 'en', 'fr', 'de', 'it', 'es')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * Formats a date and time string using the specified locale
 * @param dateString - ISO date string
 * @param locale - Locale code (e.g., 'en', 'fr', 'de', 'it', 'es')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date and time string
 */
export function formatDateTime(
  dateString: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = new Date(dateString);
  return date.toLocaleString(locale, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...options,
  });
}

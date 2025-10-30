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

/**
 * Formats a Date into hour and minute strings with optional timezone handling.
 * Gracefully falls back to no timeZone if Intl throws.
 */
export function formatHourMinute(
  date: Date,
  timeZone: string,
  locale: string
): { hour: string; minute: string } {
  try {
    const parts = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).formatToParts(date);

    const hourPart = parts.find(p => p.type === 'hour')?.value ?? '';
    const minutePart = parts.find(p => p.type === 'minute')?.value ?? '';

    const hour = hourPart.padStart(2, '0');
    const minute = minutePart.padStart(2, '0');
    return { hour, minute };
  } catch {
    const parts = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(date);
    const hourPart = parts.find(p => p.type === 'hour')?.value ?? '';
    const minutePart = parts.find(p => p.type === 'minute')?.value ?? '';
    const hour = hourPart.padStart(2, '0');
    const minute = minutePart.padStart(2, '0');
    return { hour, minute };
  }
}

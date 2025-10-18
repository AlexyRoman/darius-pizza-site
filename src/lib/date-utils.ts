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
 * Formats a date range using the specified locale
 * @param startDateString - ISO start date string
 * @param endDateString - ISO end date string
 * @param locale - Locale code (e.g., 'en', 'fr', 'de', 'it', 'es')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDateString: string,
  endDateString: string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  // Check if dates are on the same day
  const isSameDay = startDate.toDateString() === endDate.toDateString();

  if (isSameDay) {
    // Same day - show date once with time range
    const dateStr = startDate.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    });

    const startTime = startDate.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
    });

    const endTime = endDate.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
    });

    return `${dateStr} (${startTime} - ${endTime})`;
  } else {
    // Different days - show date range
    const startStr = startDate.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      ...options,
    });

    const endStr = endDate.toLocaleDateString(locale, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      ...options,
    });

    return `${startStr} - ${endStr}`;
  }
}

/**
 * Gets the day name in the specified locale
 * @param dateString - ISO date string
 * @param locale - Locale code (e.g., 'en', 'fr', 'de', 'it', 'es')
 * @returns Day name in the specified locale
 */
export function getDayName(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, { weekday: 'long' });
}

/**
 * Gets the month name in the specified locale
 * @param dateString - ISO date string
 * @param locale - Locale code (e.g., 'en', 'fr', 'de', 'it', 'es')
 * @returns Month name in the specified locale
 */
export function getMonthName(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, { month: 'long' });
}

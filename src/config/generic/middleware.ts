/**
 * Generic Middleware Configuration
 *
 * This file contains generic, reusable configuration for Next.js middleware
 * that can be used across different applications. These constants rarely change
 * and are framework-level configuration.
 *
 * ⚠️ IMPORTANT: When updating STATIC_PATH_PREFIXES or STATIC_FILE_EXTENSIONS,
 * you MUST also update the matcher pattern in src/middleware.ts to keep them in sync.
 * Next.js requires the matcher to be a static string literal (no dynamic values).
 *
 * The config values here are used for runtime path checking in isStaticPath().
 * The matcher pattern in middleware.ts tells Next.js which paths to run middleware on.
 */

/**
 * Path prefixes that should be excluded from middleware processing
 * These paths are passed directly to next-intl middleware without redirect logic
 *
 * This is generic for Next.js apps but can be customized per application
 *
 * ⚠️ If you add/remove entries here, update the matcher in src/middleware.ts too!
 */
export const STATIC_PATH_PREFIXES = [
  '/api',
  '/_next',
  '/static',
  '/images',
  '/flags',
  '/fonts',
] as const;

/**
 * File extensions that should be excluded from middleware processing
 *
 * This is generic for Next.js apps but can be customized per application
 *
 * ⚠️ If you add/remove entries here, update the matcher in src/middleware.ts too!
 */
export const STATIC_FILE_EXTENSIONS = [
  'ico',
  'png',
  'jpg',
  'jpeg',
  'svg',
  'webp',
] as const;

/**
 * Pattern to match static file extensions
 * Computed from STATIC_FILE_EXTENSIONS
 */
export const STATIC_FILE_PATTERN = new RegExp(
  `\\.(${STATIC_FILE_EXTENSIONS.join('|')})$`,
  'i'
);

/**
 * Default HTTP status code for permanent redirects (301)
 * Used for SEO-friendly permanent redirects
 *
 * This is a standard HTTP status code and is generic
 */
export const PERMANENT_REDIRECT_STATUS = 301 as const;

/**
 * Temporary redirect status that should be converted to permanent (307 -> 301)
 * next-intl middleware may return temporary redirects for locale prefixes,
 * which we convert to permanent redirects for SEO benefits
 *
 * This is a standard HTTP status code and is generic
 */
export const TEMPORARY_REDIRECT_STATUS = 307 as const;

/**
 * Whether to convert temporary redirects (307) to permanent redirects (301)
 * This improves SEO by ensuring locale prefix redirects are permanent
 *
 * This is a middleware behavior setting - generic but potentially configurable
 */
export const CONVERT_TEMPORARY_TO_PERMANENT = true as const;


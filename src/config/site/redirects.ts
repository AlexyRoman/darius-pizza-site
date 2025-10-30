/**
 * Site-Specific Redirect Configuration
 *
 * This file contains site-specific redirect mappings for legacy URLs.
 * Edit middleware.json to customize redirects for your site.
 */

import middlewareConfig from './middleware.json';

/**
 * Redirect mappings for legacy URLs
 * Loaded from middleware.json - site-specific configuration
 * Maps old paths to their new destinations
 */
export const REDIRECT_MAPPINGS = middlewareConfig.redirects as Record<
  string,
  string
>;

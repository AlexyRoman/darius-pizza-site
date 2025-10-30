export type RobotsRule = {
  userAgent: string;
  allow?: string[] | string;
  disallow?: string[] | string;
};

export type RobotsConfig = {
  rules: RobotsRule[];
  sitemap?: boolean;
  host?: boolean;
};

// ============================================================================
// Page Configuration Types
// ============================================================================

/**
 * Sitemap change frequency options
 * Represents how frequently a page is likely to change
 */
export type SitemapChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

/**
 * Page configuration for routing and sitemap generation
 */
export type PageConfig = {
  path: string;
  sitemapPriority?: number;
  sitemapChangeFrequency?: SitemapChangeFrequency;
  sitemapEnabled?: boolean;
};

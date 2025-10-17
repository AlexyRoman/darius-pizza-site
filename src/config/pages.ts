export type SitemapChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export type PageConfig = {
  path: string;
  sitemapPriority?: number;
  sitemapChangeFrequency?: SitemapChangeFrequency;
  sitemapEnabled?: boolean;
};

export const PAGES = {
  home: {
    path: '/',
    sitemapPriority: 1.0,
    sitemapChangeFrequency: 'daily',
    sitemapEnabled: true,
  },
  menu: {
    path: '/menu',
    sitemapPriority: 0.8,
    sitemapChangeFrequency: 'weekly',
    sitemapEnabled: true,
  },
  info: {
    path: '/info',
    sitemapPriority: 0.5,
    sitemapChangeFrequency: 'yearly',
    sitemapEnabled: true,
  },
  contact: {
    path: '/contact',
    sitemapPriority: 0.6,
    sitemapChangeFrequency: 'monthly',
    sitemapEnabled: true,
  },
} satisfies Record<string, PageConfig>;

export type PageKey = keyof typeof PAGES;

export const PATHNAMES = Object.values(PAGES).reduce(
  (acc, curr) => {
    acc[curr.path] = curr.path;
    return acc;
  },
  {} as Record<string, string>
);

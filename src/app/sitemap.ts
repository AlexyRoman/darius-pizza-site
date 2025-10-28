import { localesConfig } from '@/config/locales-config';
import { PAGES, PATHNAMES } from '@/config/pages';

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env['NEXT_PUBLIC_SITE_URL'] || 'https://www.dariuspizza.fr';
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  // Root and base pages
  Object.values(PATHNAMES).forEach(path => {
    const page = Object.values(PAGES).find(p => p.path === path);
    const isEnabled = page ? (page.sitemapEnabled ?? true) : false;
    if (!page || !isEnabled) return;
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: (page.sitemapChangeFrequency ??
        'daily') as MetadataRoute.Sitemap[number]['changeFrequency'],
      priority: page.sitemapPriority ?? 0.8,
    });
  });

  // Locale-prefixed pages
  localesConfig.locales
    .filter(l => l.enabled)
    .forEach(locale => {
      Object.values(PAGES).forEach(page => {
        const isEnabled = page.sitemapEnabled ?? true;
        if (!isEnabled) return;
        const path = page.path;
        entries.push({
          url: `${baseUrl}/${locale.code}${path === '/' ? '' : path}`,
          lastModified: now,
          changeFrequency: (page.sitemapChangeFrequency ??
            'daily') as MetadataRoute.Sitemap[number]['changeFrequency'],
          priority: (page.sitemapPriority ?? 0.9) as number,
        });
      });
    });

  return entries;
}

import { localesConfig } from '@/config/locales-config';
import { PAGES } from '@/config/pages';

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env['NEXT_PUBLIC_SITE_URL'] || 'https://www.dariuspizza.fr';
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  // Only include locale-prefixed pages to avoid 301 redirects
  // Since middleware uses localePrefix: 'always', non-prefixed URLs redirect
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

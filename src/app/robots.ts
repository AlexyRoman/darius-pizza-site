import robotsConfig from '@/config/robots';

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env['NEXT_PUBLIC_SITE_URL'] || 'http://localhost:3000';

  return {
    rules: robotsConfig.rules,
    sitemap: robotsConfig.sitemap ? [`${baseUrl}/sitemap.xml`] : undefined,
    host: robotsConfig.host ? baseUrl : undefined,
  };
}

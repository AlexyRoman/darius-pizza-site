import robotsConfig from '@/config/generic/robots';

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  try {
    const baseUrl =
      process.env['NEXT_PUBLIC_SITE_URL'] || 'https://www.dariuspizza.fr';

    return {
      rules: robotsConfig.rules,
      sitemap: robotsConfig.sitemap ? [`${baseUrl}/sitemap.xml`] : undefined,
      host: robotsConfig.host ? baseUrl : undefined,
    };
  } catch (err) {
    console.error('[robots]', err);
    return {
      rules: [{ userAgent: '*', allow: '/', disallow: [] }],
      sitemap: undefined,
      host: undefined,
    };
  }
}

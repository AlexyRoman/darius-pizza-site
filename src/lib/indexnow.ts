import { localesConfig } from '@/config/generic/locales-config';
import { PAGES } from '@/config/site/pages';

const INDEXNOW_API = 'https://api.indexnow.org/indexnow';

/**
 * Builds the list of all public sitemap URLs (all locales, all pages).
 * Use for IndexNow submission and must match sitemap.xml.
 */
export function getSitemapUrlList(baseUrl: string): string[] {
  const base = baseUrl.replace(/\/$/, '');
  const urls: string[] = [];

  localesConfig.locales
    .filter(l => l.enabled)
    .forEach(locale => {
      Object.values(PAGES).forEach(page => {
        const isEnabled = page.sitemapEnabled ?? true;
        if (!isEnabled) return;
        const path = page.path;
        urls.push(`${base}/${locale.code}${path === '/' ? '' : path}`);
      });
    });

  return urls;
}

/**
 * Submits a list of URLs to IndexNow (Bing, Yandex, Edge, etc.).
 * Key file must be available at keyLocation (e.g. https://yoursite.com/{key}.txt).
 */
export async function submitIndexNow(options: {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}): Promise<Response> {
  const { host, key, keyLocation, urlList } = options;
  if (!host || !key || !keyLocation || urlList.length === 0) {
    throw new Error(
      'IndexNow: host, key, keyLocation and non-empty urlList are required.'
    );
  }

  return fetch(INDEXNOW_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList,
    }),
  });
}

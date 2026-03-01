import { getSitemapUrlList } from '@/lib/indexnow';

describe('indexnow', () => {
  describe('getSitemapUrlList', () => {
    it('returns one URL per locale per page', () => {
      const baseUrl = 'https://dariuspizza.fr';
      const urls = getSitemapUrlList(baseUrl);
      expect(urls.length).toBeGreaterThan(0);
      expect(urls.every(u => u.startsWith(baseUrl))).toBe(true);
      // All locales (fr, en, de, es, it, nl) × pages (home, menu, info, privacy, cookies, legal-mentions)
      expect(urls).toContain('https://dariuspizza.fr/fr');
      expect(urls).toContain('https://dariuspizza.fr/en');
      expect(urls).toContain('https://dariuspizza.fr/fr/menu');
      expect(urls).toContain('https://dariuspizza.fr/en/menu');
    });

    it('strips trailing slash from baseUrl', () => {
      const urls = getSitemapUrlList('https://dariuspizza.fr/');
      // No double slash between host and path
      expect(urls.every(u => !/https?:\/\/[^/]+\/\//.test(u))).toBe(true);
      expect(urls).toContain('https://dariuspizza.fr/fr');
    });
  });
});

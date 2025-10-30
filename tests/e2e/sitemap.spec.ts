import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('sitemap.xml', () => {
  test('serves sitemap.xml at root without locale', async ({ page }) => {
    const response = await page.goto(`${BASE}/sitemap.xml`);
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/(application|text)\/xml/i);
    const body = await response!.text();
    expect(body).toMatch(/<urlset|<url>/i);
  });

  test('localized path does not redirect and serves root sitemap.xml', async ({
    page,
  }) => {
    const response = await page.goto(`${BASE}/fr/sitemap.xml`);
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/(application|text)\/xml/i);
    const body = await response!.text();
    expect(body).toMatch(/<urlset|<url>/i);
  });
});

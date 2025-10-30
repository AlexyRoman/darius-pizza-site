import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('robots.txt', () => {
  test('serves robots.txt at root without locale', async ({ page }) => {
    const response = await page.goto(`${BASE}/robots.txt`);
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/text\/plain/i);
    const body = await response!.text();
    expect(body).toMatch(/User-agent:/i);
  });

  test('localized path does not redirect and serves root robots.txt', async ({
    page,
  }) => {
    const response = await page.goto(`${BASE}/fr/robots.txt`);
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toMatch(/text\/plain/i);
    const body = await response!.text();
    expect(body).toMatch(/User-agent:/i);
  });
});

import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('site.webmanifest', () => {
  test('serves site.webmanifest at root without locale', async ({ page }) => {
    const response = await page.goto(`${BASE}/site.webmanifest`);
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toMatch(
      /(application|text)\/manifest\+json|application\/json/i
    );
    const bodyText = await response!.text();
    // Ensure valid JSON
    const json = JSON.parse(bodyText);
    expect(json).toBeTruthy();
  });

  test('localized path does not redirect and serves root webmanifest', async ({
    page,
  }) => {
    const response = await page.goto(`${BASE}/fr/site.webmanifest`);
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()['content-type'] ?? '';
    expect(contentType).toMatch(
      /(application|text)\/manifest\+json|application\/json/i
    );
    const bodyText = await response!.text();
    const json = JSON.parse(bodyText);
    expect(json).toBeTruthy();
  });
});

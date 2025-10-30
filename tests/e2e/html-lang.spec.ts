import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('HTML lang attribute', () => {
  test('sets correct lang for each locale', async ({ page }) => {
    const locales = ['en', 'fr', 'de', 'it', 'es', 'nl'];

    for (const locale of locales) {
      await page.goto(`${BASE}/${locale}`);

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check html lang attribute matches locale
      const htmlLang = await page.evaluate(() =>
        document.documentElement.getAttribute('lang')
      );

      expect(htmlLang).toBe(locale);
    }
  });

  test('changes lang when locale is switched', async ({ page }) => {
    // Start on EN
    await page.goto(`${BASE}/en`);
    await page.waitForLoadState('networkidle');

    let htmlLang = await page.evaluate(() =>
      document.documentElement.getAttribute('lang')
    );
    expect(htmlLang).toBe('en');

    // Switch to FR
    await page.getByRole('button', { name: 'Change language' }).click();
    await page.getByRole('menuitem').filter({ hasText: 'FR' }).click();

    await expect(page).toHaveURL(/\/fr(\/?|$)/);
    await page.waitForLoadState('networkidle');

    htmlLang = await page.evaluate(() =>
      document.documentElement.getAttribute('lang')
    );
    expect(htmlLang).toBe('fr');

    // Switch to DE
    await page.getByRole('button', { name: 'Change language' }).click();
    await page.getByRole('menuitem').filter({ hasText: 'DE' }).click();

    await expect(page).toHaveURL(/\/de(\/?|$)/);
    await page.waitForLoadState('networkidle');

    htmlLang = await page.evaluate(() =>
      document.documentElement.getAttribute('lang')
    );
    expect(htmlLang).toBe('de');
  });

  test('sets default lang for root path', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState('networkidle');

    const htmlLang = await page.evaluate(() =>
      document.documentElement.getAttribute('lang')
    );

    // Should default to 'fr' based on routing.defaultLocale
    expect(htmlLang).toBe('fr');
  });

  test('sets correct lang for nested pages', async ({ page }) => {
    await page.goto(`${BASE}/fr/menu`);
    await page.waitForLoadState('networkidle');

    let htmlLang = await page.evaluate(() =>
      document.documentElement.getAttribute('lang')
    );
    expect(htmlLang).toBe('fr');

    await page.goto(`${BASE}/de/cookies`);
    await page.waitForLoadState('networkidle');

    htmlLang = await page.evaluate(() =>
      document.documentElement.getAttribute('lang')
    );
    expect(htmlLang).toBe('de');

    await page.goto(`${BASE}/en/info`);
    await page.waitForLoadState('networkidle');

    htmlLang = await page.evaluate(() =>
      document.documentElement.getAttribute('lang')
    );
    expect(htmlLang).toBe('en');
  });
});

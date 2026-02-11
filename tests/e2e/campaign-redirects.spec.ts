import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Campaign redirects - DEMO', () => {
  test('/q/DEMO redirects to /en without extra params', async ({ page }) => {
    await page.goto(`${BASE}/q/DEMO`);

    await expect(page).toHaveURL(/\/en(\/|\?|$)/);

    const url = new URL(page.url());
    // No utm parameters should be injected
    for (const [key] of url.searchParams.entries()) {
      expect(key.startsWith('utm_')).toBe(false);
    }
  });

  test('/q/DEMO preserves incoming query parameters', async ({ page }) => {
    await page.goto(`${BASE}/q/DEMO?ref=flyer`);

    await expect(page).toHaveURL(/\/en(\/|\?|$)/);

    const url = new URL(page.url());
    expect(url.searchParams.get('ref')).toBe('flyer');
  });
});

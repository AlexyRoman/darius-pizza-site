import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Q redirects (/q/XXXX → ?qr=XXXX)', () => {
  test('/q/DEMO redirects and adds qr=DEMO to URL', async ({ page }) => {
    await page.goto(`${BASE}/q/DEMO`);

    const url = new URL(page.url());
    expect(url.searchParams.get('qr')).toBe('DEMO');
    // Locale may be applied (e.g. /fr, /en) or root /
    expect(url.pathname).toMatch(/^\/(fr|en|de|it|es|nl)?\/?$/);
  });

  test('/q/DEMO preserves incoming query parameters and adds qr', async ({
    page,
  }) => {
    await page.goto(`${BASE}/q/DEMO?ref=flyer`);

    const url = new URL(page.url());
    expect(url.searchParams.get('qr')).toBe('DEMO');
    expect(url.searchParams.get('ref')).toBe('flyer');
  });

  test('any 4-char code works (dynamic)', async ({ page }) => {
    await page.goto(`${BASE}/q/BT26`);

    const url = new URL(page.url());
    expect(url.searchParams.get('qr')).toBe('BT26');
  });
});

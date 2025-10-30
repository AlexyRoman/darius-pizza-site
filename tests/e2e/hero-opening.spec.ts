import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

function mockNowTo(page: any, iso: string) {
  return page.addInitScript(`
    (() => {
      const fixed = new Date(${JSON.stringify(iso)}).valueOf();
      const _Date = Date;
      class MockDate extends _Date {
        constructor(...args: any[]) {
          if (args.length === 0) { super(fixed); } else { super(...args as any); }
        }
        static now() { return fixed; }
      }
      // @ts-ignore
      window.Date = MockDate;
    })();
  `);
}

test.describe('Hero badge and Call CTA behavior', () => {
  test('shows status badge and Menu CTA', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    // Badge present via translated text
    await expect(
      page.locator('section').filter({ hasText: /Open now|Currently closed|Opens in|Closed/i })
    ).toBeVisible();
    // Menu CTA exists and navigates
    const menuCta = page.getByRole('link', { name: /View our menu|View full menu|Menu/i }).first();
    await expect(menuCta).toBeVisible();
    await Promise.all([
      page.waitForURL(/\/en\/menu/),
      menuCta.click(),
    ]);
  });

  test('Call CTA opens dialog when closed (early morning)', async ({ page }) => {
    await mockNowTo(page, '2024-06-10T03:30:00.000Z'); // Monday 03:30 UTC
    await page.goto(`${BASE}/en`);
    const callBtn = page.getByRole('button', { name: /Order by phone/i }).first();
    await callBtn.click();
    // Dialog title from callDialog translations
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test.skip('hero badge shows closed during scheduled closing', async ({ page }) => {
    await mockNowTo(page, '2025-10-20T12:00:00.000Z');
    await page.goto(`${BASE}/en`);
    await page.waitForTimeout(600); // allow hydration and config load
    await expect(page.getByText(/Currently closed/i)).toBeVisible();
  });
});



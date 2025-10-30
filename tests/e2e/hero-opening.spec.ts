import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // Dismiss cookie banner if it appears
    await page
      .getByRole('button', { name: /Accept All|Decline All/i })
      .first()
      .click({ timeout: 2000 })
      .catch(() => {});

    // Wait for hydrated badge text to appear
    await page.waitForSelector(
      'text=/Open now|Currently closed|Opens in|Closed/i',
      { timeout: 5000 }
    );
    // Badge present via translated text (scope to hero section to avoid strict mode)
    const hero = page.locator('section').first();
    await expect(
      hero.getByText(/Open now|Currently closed|Opens in|Closed/i)
    ).toBeVisible();
    // Menu CTA exists and navigates
    const menuCta = page
      .getByRole('link', { name: /View our menu|View full menu|Menu/i })
      .first();
    await expect(menuCta).toBeVisible();
    await Promise.all([page.waitForURL(/\/en\/menu/), menuCta.click()]);
  });

  test('Call CTA opens dialog when closed (early morning)', async ({
    page,
  }) => {
    await mockNowTo(page, '2024-06-10T03:30:00.000Z'); // Monday 03:30 UTC
    await page.goto(`${BASE}/en`);
    // Dismiss cookie banner if it appears
    await page
      .getByRole('button', { name: /Accept All|Decline All/i })
      .first()
      .click({ timeout: 2000 })
      .catch(() => {});
    const callBtn = page
      .getByRole('button', { name: /Order by phone/i })
      .first();
    await callBtn.scrollIntoViewIfNeeded();
    await callBtn.click({ delay: 50 });
    // Wait for dialog action button to appear
    await expect(page.getByRole('button', { name: /Call Now/i })).toBeVisible({
      timeout: 7000,
    });
  });

  test.skip('hero badge shows closed during scheduled closing', async ({
    page,
  }) => {
    await mockNowTo(page, '2025-10-20T12:00:00.000Z');
    await page.goto(`${BASE}/en`);
    await page.waitForTimeout(600); // allow hydration and config load
    await expect(page.getByText(/Currently closed/i)).toBeVisible();
  });
});

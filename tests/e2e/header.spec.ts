import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Header - locale and theme', () => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function mockNowTo(page: any, iso: string) {
    await page.addInitScript(`
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
  test('change locale switches URL and text', async ({ page }) => {
    await page.goto(`${BASE}/en`);

    // Open locale dropdown and select FR
    await page.getByRole('button', { name: 'Change language' }).click();
    await page.getByRole('menuitem').filter({ hasText: 'FR' }).click();

    await expect(page).toHaveURL(/\/fr(\/?|$)/);
    // Assert that a Menu link points to fr path
    const menuLink = page
      .getByRole('navigation')
      .getByRole('link', { name: /Menu/i })
      .first();
    await expect(menuLink).toHaveAttribute('href', /\/fr\/menu/);
  });

  test('cycle theme toggles html.dark class', async ({ page }) => {
    // Force a known initial theme before hydration
    await page.addInitScript(() => {
      try {
        localStorage.setItem('darius-pizza-theme', 'light');
      } catch {}
    });
    await page.goto(`${BASE}/en`);

    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /Switch theme/ }).first();

    const initialIsDark = await html.evaluate(el =>
      el.classList.contains('dark')
    );
    // Try a few times in case a transition or hydration delays the toggle
    for (let i = 0; i < 5; i++) {
      await toggle.click();
      await page.waitForTimeout(100);
      const changed = await html.evaluate(
        (el, initial) => el.classList.contains('dark') !== initial,
        initialIsDark
      );
      if (changed) break;
    }
    const finalIsDark = await html.evaluate(el =>
      el.classList.contains('dark')
    );
    expect(finalIsDark).not.toBe(initialIsDark);
  });

  test('header Call CTA opens dialog when closed', async ({ page }) => {
    // Tuesday at 03:30 UTC (05:30 Paris) - restaurant is closed (opens at 18:00)
    // Using a time when restaurant is definitely closed to trigger dialog
    await mockNowTo(page, '2024-06-11T03:30:00.000Z'); // Tuesday 03:30 UTC
    await page.goto(`${BASE}/en`);

    // Dismiss cookie banner if it appears
    await page
      .getByRole('button', { name: /Accept All|Decline All/i })
      .first()
      .click({ timeout: 2000 })
      .catch(() => {});

    // Wait for component to hydrate and compute opening status
    // The SmartCallButton needs to mount and compute shouldShowAlert
    await page.waitForTimeout(800);

    // Find the Call/Order button by aria-label in header (locale may be "Order" or "Call")
    const headerCall = page
      .getByRole('button', { name: /Order|Call/i })
      .first();
    await headerCall.waitFor({ state: 'visible' });
    // Ensure in viewport then click
    await headerCall.scrollIntoViewIfNeeded();

    // Verify button is clickable (not a tel: link when closed)
    const isButton = await headerCall.evaluate(el => el.tagName === 'BUTTON');
    expect(isButton).toBe(true);

    await headerCall.click({ delay: 50 });

    // Wait for dialog content (buttons) to avoid role-only flakiness
    await expect(page.getByRole('button', { name: /Call Now/i })).toBeVisible({
      timeout: 7000,
    });
  });
});

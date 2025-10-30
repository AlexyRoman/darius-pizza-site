import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Header - locale and theme', () => {
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
    const menuLink = page.getByRole('navigation').getByRole('link', { name: /Menu/i }).first();
    await expect(menuLink).toHaveAttribute('href', /\/fr\/menu/);
  });

  test('cycle theme toggles html.dark class', async ({ page }) => {
    await page.goto(`${BASE}/en`);

    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: /Switch theme/ }).first();

    const initialIsDark = await html.evaluate(el => el.classList.contains('dark'));
    for (let i = 0; i < 3; i++) {
      await toggle.click();
      const changed = await html.evaluate((el, initial) => el.classList.contains('dark') !== initial, initialIsDark);
      if (changed) break;
    }
    const finalIsDark = await html.evaluate(el => el.classList.contains('dark'));
    expect(finalIsDark).not.toBe(initialIsDark);
  });

  test('header Call CTA opens dialog when closed', async ({ page }) => {
    // Within active closing window from closings config (2025-10-10 to 2025-10-29T22:00Z)
    await mockNowTo(page, '2025-10-20T12:00:00.000Z');
    await page.goto(`${BASE}/en`);
    const headerCall = page.getByRole('button', { name: /^Call$/i }).first();
    await headerCall.click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});



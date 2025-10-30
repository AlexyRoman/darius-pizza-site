import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Footer navigation', () => {
  test('navigates to legal and menu pages', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    // Explore links (Menu)
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: /Menu/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/menu/);

    // Back to home and open Privacy from footer
    await page.goto(`${BASE}/en`);
    const footer = page.getByRole('contentinfo');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator('a[href="/en/privacy"]').first()).toBeVisible();
  });
});

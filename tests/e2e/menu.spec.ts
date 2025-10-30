import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Menu page', () => {
  test('shows items and allergen legend, respects locale', async ({ page }) => {
    await page.goto(`${BASE}/en/menu`);

    // Wait for at least one product image to appear
    await expect(page.locator('img[alt$=" image"]').first()).toBeVisible();

    // Items are rendered (ensure at least one title appears)
    await expect(page.locator('h1,h2,h3').first()).toBeVisible();

    // Allergen legend trigger exists (dynamic component)
    await expect(page.getByText('Allergens')).toBeVisible();

    // Switch locale to FR and see URL updates
    await page.getByRole('button', { name: 'Change language' }).click();
    await page.getByRole('menuitem').filter({ hasText: 'FR' }).click();
    await expect(page).toHaveURL(/\/fr\/menu/);
  });
});



import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Navbar navigation', () => {
  test('navigate between Home, Menu, Info', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page.getByRole('navigation').getByRole('link', { name: /Menu/i }).first().click();
    await expect(page).toHaveURL(/\/en\/menu/);

    await page.getByRole('navigation').getByRole('link', { name: /Info/i }).first().click();
    await expect(page).toHaveURL(/\/en\/info/);

    await page.getByRole('navigation').getByRole('link', { name: /Home/i }).first().click();
    await expect(page).toHaveURL(/\/en(\/?|$)/);
  });
});



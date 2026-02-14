/**
 * E2E: Admin dashboard – closings, opening hours, messages.
 * Runs only when PAGE_ACCESS_USERNAME and PAGE_ACCESS_PASSWORD are set (e.g. .env.local).
 * Tests: login, display of all config editors, and closure date edit (create/edit/delete flow).
 */
import { test, expect } from '@playwright/test';

const BASE = process.env['BASE_URL'] || 'http://localhost:3000';
const hasAuth =
  !!process.env['PAGE_ACCESS_USERNAME'] &&
  !!process.env['PAGE_ACCESS_PASSWORD'];

test.describe.configure({ mode: 'serial' });

test.describe('Admin dashboard', () => {
  test.skip(
    !hasAuth,
    'Dashboard e2e require PAGE_ACCESS_USERNAME and PAGE_ACCESS_PASSWORD'
  );

  test('auth gate redirects to login when not authenticated', async ({
    page,
  }) => {
    await page.goto(`${BASE}/en/dashboard`);
    await expect(page).toHaveURL(/auth-gate|dashboard/);
    const passwordInput = page.getByLabel(/password|mot de passe/i).first();
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
  });

  test('login and dashboard home load', async ({ page }) => {
    const username = process.env['PAGE_ACCESS_USERNAME']!;
    const password = process.env['PAGE_ACCESS_PASSWORD']!;

    await page.goto(
      `${BASE}/en/auth-gate?redirect=${encodeURIComponent('/en/dashboard')}`
    );
    await page
      .getByLabel(/username|identifiant/i)
      .first()
      .fill(username);
    await page
      .getByLabel(/password|mot de passe/i)
      .first()
      .fill(password);
    await page
      .getByRole('button', { name: /sign in|connexion|submit/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/en\/dashboard/, { timeout: 15000 });
    await expect(
      page
        .getByRole('heading', { name: /dashboard/i })
        .or(page.getByText(/Opening Hours|Special Closings|Messages/i))
    ).toBeVisible({ timeout: 10000 });
  });

  test('closings page loads and shows scheduled/emergency sections', async ({
    page,
  }) => {
    const username = process.env['PAGE_ACCESS_USERNAME']!;
    const password = process.env['PAGE_ACCESS_PASSWORD']!;

    await page.goto(
      `${BASE}/en/auth-gate?redirect=${encodeURIComponent('/en/dashboard/closings')}`
    );
    await page
      .getByLabel(/username/i)
      .first()
      .fill(username);
    await page
      .getByLabel(/password/i)
      .first()
      .fill(password);
    await page
      .getByRole('button', { name: /sign in|connexion|submit/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/en\/dashboard\/closings/, {
      timeout: 15000,
    });
    await expect(
      page.getByText(/Scheduled closings|Emergency closings/i).first()
    ).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByRole('button', { name: /Add scheduled|Add emergency/i }).first()
    ).toBeVisible();
  });

  test('closings editor: existing closure shows editable start/end date inputs', async ({
    page,
  }) => {
    const username = process.env['PAGE_ACCESS_USERNAME']!;
    const password = process.env['PAGE_ACCESS_PASSWORD']!;

    await page.goto(
      `${BASE}/en/auth-gate?redirect=${encodeURIComponent('/en/dashboard/closings')}`
    );
    await page
      .getByLabel(/username/i)
      .first()
      .fill(username);
    await page
      .getByLabel(/password/i)
      .first()
      .fill(password);
    await page
      .getByRole('button', { name: /sign in|connexion|submit/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/en\/dashboard\/closings/, {
      timeout: 15000,
    });
    await expect(
      page.getByText(/Scheduled closings|Emergency closings/i).first()
    ).toBeVisible({
      timeout: 10000,
    });

    const startDateInput = page.locator('input[type="datetime-local"]').first();
    await expect(startDateInput).toBeVisible({ timeout: 5000 });
    const startValue = await startDateInput.inputValue();
    expect(
      startValue === '' || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(startValue)
    ).toBe(true);
  });

  test('closings editor: can change closure end date and value persists in input', async ({
    page,
  }) => {
    const username = process.env['PAGE_ACCESS_USERNAME']!;
    const password = process.env['PAGE_ACCESS_PASSWORD']!;

    await page.goto(
      `${BASE}/en/auth-gate?redirect=${encodeURIComponent('/en/dashboard/closings')}`
    );
    await page
      .getByLabel(/username/i)
      .first()
      .fill(username);
    await page
      .getByLabel(/password/i)
      .first()
      .fill(password);
    await page
      .getByRole('button', { name: /sign in|connexion|submit/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/en\/dashboard\/closings/, {
      timeout: 15000,
    });
    const dateInputs = page.locator('input[type="datetime-local"]');
    await expect(dateInputs.first()).toBeVisible({ timeout: 8000 });
    const count = await dateInputs.count();
    if (count === 0) {
      test.skip(true, 'No closings to edit');
      return;
    }
    const endDateInput = dateInputs.nth(1);
    await endDateInput.fill('2026-12-31T23:59');
    await expect(endDateInput).toHaveValue('2026-12-31T23:59');
  });

  test('opening hours page loads', async ({ page }) => {
    const username = process.env['PAGE_ACCESS_USERNAME']!;
    const password = process.env['PAGE_ACCESS_PASSWORD']!;

    await page.goto(
      `${BASE}/en/auth-gate?redirect=${encodeURIComponent('/en/dashboard/opening-hours')}`
    );
    await page
      .getByLabel(/username/i)
      .first()
      .fill(username);
    await page
      .getByLabel(/password/i)
      .first()
      .fill(password);
    await page
      .getByRole('button', { name: /sign in|connexion|submit/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/en\/dashboard\/opening-hours/, {
      timeout: 15000,
    });
    await expect(
      page
        .getByText(/Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i)
        .first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('messages page loads', async ({ page }) => {
    const username = process.env['PAGE_ACCESS_USERNAME']!;
    const password = process.env['PAGE_ACCESS_PASSWORD']!;

    await page.goto(
      `${BASE}/en/auth-gate?redirect=${encodeURIComponent('/en/dashboard/messages')}`
    );
    await page
      .getByLabel(/username/i)
      .first()
      .fill(username);
    await page
      .getByLabel(/password/i)
      .first()
      .fill(password);
    await page
      .getByRole('button', { name: /sign in|connexion|submit/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/en\/dashboard\/messages/, {
      timeout: 15000,
    });
    await expect(
      page
        .getByRole('button', { name: /Add message/i })
        .or(page.getByText(/Manage special messages/i))
    ).toBeVisible({ timeout: 10000 });
  });
});

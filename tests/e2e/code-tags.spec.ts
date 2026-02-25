import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

test.describe('Code tags analytics', () => {
  test('landing with ?qr=DEMO triggers analytics API', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(
        res =>
          res.url().includes('/api/analytics/qr') &&
          res.url().includes('code=DEMO') &&
          res.status() === 200,
        { timeout: 15000 }
      ),
      page.goto(`${BASE}/en?qr=DEMO`),
    ]);
    expect(response.status()).toBe(200);
  });

  test('different code QR02 triggers analytics API', async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    const [response] = await Promise.all([
      page.waitForResponse(
        res =>
          res.url().includes('/api/analytics/qr') &&
          res.url().includes('code=QR02') &&
          res.status() === 200,
        { timeout: 15000 }
      ),
      page.goto(`${BASE}/en?qr=QR02`),
    ]);
    expect(response.status()).toBe(200);
  });

  test('unauthenticated dashboard code-tags shows login form', async ({
    page,
    context,
  }) => {
    await context.clearCookies();
    await page.goto(`${BASE}/en/dashboard/code-tags`);
    // Login form shows "Protected Content" and an Access/Accéder button (no heading with login/password)
    await expect(
      page.getByRole('button', { name: /access|accéder/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('authenticated dashboard code-tags page loads', async ({
    page,
    context,
  }) => {
    const user = process.env.E2E_DASHBOARD_USER;
    const pass = process.env.E2E_DASHBOARD_PASS;
    test.skip(
      !user || !pass,
      'E2E_DASHBOARD_USER and E2E_DASHBOARD_PASS required'
    );

    await context.clearCookies();
    await page.goto(`${BASE}/en/dashboard`);
    await page.getByLabel('Username').fill(user!);
    await page.getByLabel('Password').fill(pass!);
    await page
      .getByRole('button', { name: /Access|Accéder|Checking|Vérification/ })
      .click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    await page.goto(`${BASE}/en/dashboard/code-tags`);
    await expect(
      page.getByRole('heading', { name: /code tags|codes campagne/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('full flow: scan then dashboard shows increment', async ({
    page,
    context,
  }) => {
    const user = process.env.E2E_DASHBOARD_USER;
    const pass = process.env.E2E_DASHBOARD_PASS;
    test.skip(
      !user || !pass,
      'E2E_DASHBOARD_USER and E2E_DASHBOARD_PASS required'
    );

    await context.clearCookies();

    await page.goto(`${BASE}/en?qr=E2ET`);
    await page.waitForResponse(
      res =>
        res.url().includes('/api/analytics/qr') &&
        res.url().includes('code=E2ET') &&
        res.status() === 200,
      { timeout: 15000 }
    );

    await page.goto(`${BASE}/en/dashboard`);
    await page.getByLabel('Username').fill(user!);
    await page.getByLabel('Password').fill(pass!);
    await page
      .getByRole('button', { name: /Access|Accéder|Checking|Vérification/ })
      .click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });

    await page.goto(`${BASE}/en/dashboard/code-tags`);
    await expect(page.getByText('E2ET')).toBeVisible({ timeout: 10000 });
  });
});

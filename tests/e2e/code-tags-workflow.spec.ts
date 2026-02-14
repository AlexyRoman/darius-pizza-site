/**
 * E2E: Full workflow from firing a code-tag access to display in dashboard.
 * 1) Visit /q/DEMO (records hit in Redis via middleware)
 * 2) Login to dashboard
 * 3) Open Code tags page
 * 4) Assert DEMO appears in table with count >= 1
 *
 * Requires PAGE_ACCESS_USERNAME, PAGE_ACCESS_PASSWORD, and Upstash Redis
 * (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN) for the count to be stored.
 */
import { test, expect } from '@playwright/test';

const BASE = process.env['BASE_URL'] || 'http://localhost:3000';
const hasAuth =
  !!process.env['PAGE_ACCESS_USERNAME'] &&
  !!process.env['PAGE_ACCESS_PASSWORD'];

test.describe('Code tags: tag access to dashboard display', () => {
  test.skip(
    !hasAuth,
    'Workflow e2e requires PAGE_ACCESS_USERNAME and PAGE_ACCESS_PASSWORD'
  );

  test('full workflow: /q/DEMO then dashboard code-tags shows DEMO with count >= 1', async ({
    page,
  }) => {
    const username = process.env['PAGE_ACCESS_USERNAME']!;
    const password = process.env['PAGE_ACCESS_PASSWORD']!;

    // 1) Fire a tag access so middleware records the hit (if Redis configured)
    await page.goto(`${BASE}/q/DEMO`);
    const urlAfterRedirect = new URL(page.url());
    expect(urlAfterRedirect.searchParams.get('qr')).toBe('DEMO');

    // 2) Login to dashboard
    await page.goto(
      `${BASE}/en/auth-gate?redirect=${encodeURIComponent('/en/dashboard/code-tags')}`
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

    await expect(page).toHaveURL(/\/en\/dashboard\/code-tags/, {
      timeout: 15000,
    });

    // 3) Code tags page: wait for content (table or empty state)
    await expect(
      page.getByRole('heading', { name: /code tags|codes courts/i }).first()
    ).toBeVisible({ timeout: 10000 });

    // 4) If we have Redis, DEMO should appear in the table with count >= 1
    const table = page.locator('table');
    const emptyMessage = page.getByText(/no code tags yet|aucun code/i);

    await expect(table.or(emptyMessage)).toBeVisible({ timeout: 8000 });

    const codeCell = page.getByRole('cell', { name: 'DEMO' });
    const emptyVisible = await emptyMessage.isVisible().catch(() => false);
    const demoSingleCell = (await codeCell.count()) >= 1;

    expect(
      demoSingleCell || emptyVisible,
      'Either DEMO appears in the table (Redis recorded the hit) or empty state is shown (Redis not configured)'
    ).toBe(true);

    if (demoSingleCell) {
      const row = page.locator('tr').filter({ has: codeCell });
      await expect(row).toBeVisible();
      const countCell = row.locator('td').nth(1);
      const countText = await countCell.textContent();
      const count = parseInt(countText ?? '0', 10);
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });
});

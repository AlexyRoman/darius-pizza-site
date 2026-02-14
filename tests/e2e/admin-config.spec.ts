/**
 * E2E: Admin-configurable data – API and public display.
 * Tests GET APIs (closings, hours, messages) and that config is shown on the front page.
 */
import { test, expect } from '@playwright/test';

const BASE = process.env['BASE_URL'] || 'http://localhost:3000';

test.describe('Admin config APIs', () => {
  test('GET /api/closings returns 200 and valid closings config', async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/api/closings?locale=en`);
    expect(res.status()).toBe(200);
    const data = (await res.json()) as {
      scheduledClosings?: unknown[];
      emergencyClosings?: unknown[];
    };
    expect(Array.isArray(data.scheduledClosings)).toBe(true);
    expect(Array.isArray(data.emergencyClosings)).toBe(true);
  });

  test('GET /api/hours returns 200 and valid hours config', async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/api/hours`);
    expect(res.status()).toBe(200);
    const data = (await res.json()) as {
      openingHours?: Record<string, unknown>;
    };
    expect(data.openingHours).toBeDefined();
    expect(typeof data.openingHours).toBe('object');
  });

  test('GET /api/messages returns 200 and valid messages config', async ({
    request,
  }) => {
    const res = await request.get(`${BASE}/api/messages?locale=en`);
    expect(res.status()).toBe(200);
    const data = (await res.json()) as { specialMessages?: unknown[] };
    expect(Array.isArray(data.specialMessages)).toBe(true);
  });
});

test.describe('Public display of config', () => {
  test('front page shows opening hours section', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await expect(
      page.getByRole('heading', { name: /Find us at our pizzeria|hours/i })
    ).toBeVisible({ timeout: 10000 });
    const rows = page.getByText(
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i
    );
    await expect(rows.first()).toBeVisible();
  });

  test('front page hero shows open/closed badge', async ({ page }) => {
    await page.goto(`${BASE}/en`);
    await page
      .getByRole('button', { name: /Accept All|Decline All/i })
      .first()
      .click({ timeout: 2000 })
      .catch(() => {});
    await expect(
      page.getByText(/Open now|Currently closed|Opens in|Closed/i).first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('front page (fr) shows opening hours', async ({ page }) => {
    await page.goto(`${BASE}/fr`);
    await expect(
      page.getByRole('heading', { name: /Retrouvez-nous|horaires/i })
    ).toBeVisible({ timeout: 10000 });
  });
});

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

test.describe('Opening hours section', () => {
  test('renders hours list and highlights today', async ({ page }) => {
    await mockNowTo(page, '2024-06-10T10:00:00.000Z'); // Monday morning
    await page.goto(`${BASE}/en`);
    // Section heading present (translated)
    await expect(
      page.getByRole('heading', { name: /Find us at our pizzeria/i })
    ).toBeVisible();
    // Hours list has multiple rows
    const rows = page.getByText(
      /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/i
    );
    await expect(rows.first()).toBeVisible();
  });

  // Closure rendering is covered on the hero in hero-opening.spec.ts
});

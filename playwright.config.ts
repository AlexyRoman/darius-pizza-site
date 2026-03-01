import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: [],
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
  projects:
    process.env['E2E_ALL_BROWSERS'] === '1'
      ? [
          { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
          { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        ]
      : [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'E2E=1 NEXT_PUBLIC_E2E=1 npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env['CI'],
    timeout: 120000,
  },
  timeout: 60000,
  expect: { timeout: 10000 },
});

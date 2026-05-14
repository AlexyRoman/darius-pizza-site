/**
 * Pre-warms the dev server routes before Playwright workers start.
 * Without this, parallel workers simultaneously trigger JIT compilation on
 * the same routes, which can fail under load and return 500.
 */
const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

const ROUTES = [
  // All locale home pages (html-lang test iterates all 6)
  '/en',
  '/fr',
  '/de',
  '/it',
  '/es',
  '/nl',
  // Key sub-pages
  '/en/menu',
  '/fr/menu',
  '/en/info',
  '/de/cookies',
  '/en/dashboard',
  // Static/API routes
  '/robots.txt',
  '/sitemap.xml',
  '/site.webmanifest',
];

export default async function globalSetup() {
  for (const route of ROUTES) {
    try {
      await fetch(`${BASE}${route}`, { signal: AbortSignal.timeout(45_000) });
    } catch {
      // warmup is best-effort; failures will surface as test errors
    }
  }
}

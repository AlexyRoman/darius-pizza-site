# Code Tags Analytics — Implementation Plan

Fully ordered implementation plan derived from [07-code-tags-analytics.md](./07-code-tags-analytics.md). Use tickboxes to track progress; implement in order. Includes unit tests, E2E tests, and verification steps.

---

## Overview

| Phase  | Description                          |
| ------ | ------------------------------------ |
| **1**  | Recording lib + Upstash              |
| **2**  | API route (record hit) + cookie      |
| **3**  | Caller (landing page / component)    |
| **4**  | React Query setup                    |
| **5**  | Dashboard API + page + component     |
| **6**  | Sidebar, home card, breadcrumb, i18n |
| **7**  | Cookie policy and compliance         |
| **8**  | Unit tests                           |
| **9**  | E2E tests                            |
| **10** | Final checks                         |

---

## Phase 1 — Recording lib and Upstash

- [ ] **1.1** Create `src/lib/qr-analytics.ts` (or `src/lib/code-tag-analytics.ts`).
- [ ] **1.2** Implement `recordQrHit(code: string, request?: Request): Promise<void>`:
  - [ ] **1.2.1** Validate `code` with regex `[A-Za-z0-9]{4}` (or agreed pattern); throw or return early if invalid.
  - [ ] **1.2.2** Call Upstash Redis `INCR qr:count:{code}` (reuse existing Upstash client/env).
  - [ ] **1.2.3** Do not check cookie consent (core cookie; API route handles dedupe via cookie).
- [ ] **1.3** Implement `getQrCounts(): Promise<{ code: string; count: number }[]>`:
  - [ ] **1.3.1** Use Redis `SCAN` for keys `qr:count:*` and return list with counts, **or** maintain a set `qr:codes` and `MGET`/`GET` each.
  - [ ] **1.3.2** Return array of `{ code, count }` sorted by count descending (or sort in dashboard).
- [ ] **1.4** Add optional external POST (non-blocking) from `recordQrHit` if `QR_ANALYTICS_EXTERNAL_URL` is set; do not await in critical path.
- [ ] **1.5** Ensure env: reuse existing Upstash env (e.g. `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`); no new required env for basic flow.

---

## Phase 2 — API route (record hit) + cookie

- [ ] **2.1** Create `src/app/api/analytics/qr/route.ts`.
- [ ] **2.2** Implement GET (and optionally POST) handler:
  - [ ] **2.2.1** Read `code` from query (`?code=XXXX`) or POST body `{ code }`.
  - [ ] **2.2.2** Validate `code` (same pattern as lib); if invalid return 400.
  - [ ] **2.2.3** Read `qr_counted` cookie from request (Next.js `cookies().get('qr_counted')` or equivalent). Parse value as comma-separated list of codes.
  - [ ] **2.2.4** If `code` is already in the list → return 200 with no body and **do not** set cookie or call `recordQrHit`.
  - [ ] **2.2.5** If `code` is **not** in the list: call `recordQrHit(code)`; then set cookie `qr_counted` on the response: append this code to existing value (or set `code` if empty), `maxAge: 86400`, `path: '/'`. Return 200.
  - [ ] **2.2.6** Do **not** check cookie consent; this route runs by default (core cookie).
- [ ] **2.3** Cap cookie value length if needed (e.g. last 10 codes) to avoid oversized cookie.
- [ ] **2.4** Add unit tests for this route (Phase 8).

---

## Phase 3 — Caller (landing page / component)

- [ ] **3.1** Identify landing pages: root `/` and `/[locale]` (e.g. `src/app/[locale]/page.tsx` or layout that wraps the home view).
- [ ] **3.2** Add a **client component** (or use server component with server-side fetch) that:
  - [ ] **3.2.1** Reads `searchParams.qr` (or equivalent from props/context).
  - [ ] **3.2.2** If `qr` is present and valid (e.g. 4 alphanumeric), call `GET /api/analytics/qr?code={qr}` (or POST with `{ code: qr }`).
  - [ ] **3.2.3** Prefer React Query: `useQuery({ queryKey: ['qr-record', code], queryFn: () => fetch(...), staleTime: Infinity, retry: false, enabled: !!code })` so it fires once per code per mount. Alternatively one-off `useEffect` + fetch with ref to prevent double call.
- [ ] **3.3** Ensure the component is rendered on all locales (e.g. in layout or home page) so any `?qr=XXXX` landing triggers the call.
- [ ] **3.4** Do **not** gate this call on cookie consent; core cookie runs before acceptance.

---

## Phase 4 — React Query setup

- [ ] **4.1** Add `QueryClientProvider` if not present: create `src/providers/QueryProvider.tsx` (or use existing) that instantiates `QueryClient` and wraps `children`.
- [ ] **4.2** Wrap dashboard layout (e.g. `src/app/[locale]/(dashboard)/dashboard/layout.tsx`) with `QueryProvider` so all dashboard pages can use `useQuery`/`useMutation`. If the QR record call is from a client component on the public site, ensure that tree has access to the provider (e.g. root layout or same layout that renders the caller).
- [ ] **4.3** Set `QueryClient` defaults: e.g. `staleTime: 60_000`, `refetchOnWindowFocus: false`, `retry: 1`. Override per-query where needed.

---

## Phase 5 — Dashboard API, page, and component

- [ ] **5.1** Create `src/app/api/dashboard/code-tags/route.ts`:
  - [ ] **5.1.1** GET only. Use existing dashboard auth (session/cookie) to ensure only authenticated users can call it; return 401 if unauthenticated.
  - [ ] **5.1.2** Call `getQrCounts()` from `src/lib/qr-analytics.ts` and return JSON `{ codes: { code: string; count: number }[] }`.
- [ ] **5.2** Create dashboard page `src/app/[locale]/(dashboard)/dashboard/code-tags/page.tsx` that renders the Code Tags view (and uses dashboard layout).
- [ ] **5.3** Create `src/components/dashboard/CodeTagsView.tsx` (or `CampaignCodesView.tsx`):
  - [ ] **5.3.1** Client component. Use `useQuery` to fetch `GET /api/dashboard/code-tags` with `queryKey: ['dashboard', 'code-tags']`, `staleTime: 60_000`–`120_000`, `refetchOnWindowFocus: false`, optional `refetchInterval: 120_000`.
  - [ ] **5.3.2** UI: header with title and short description; table or card list with columns Code, Count (sort by count descending); empty state when no codes; optional Refresh button (throttled with `withThrottle` from `src/lib/pacer.ts`); optional copyable link per code (e.g. `https://yoursite.com/?qr=DEMO`).
  - [ ] **5.3.3** Use existing UI primitives (Table, Card, etc.) for consistency.

---

## Phase 6 — Sidebar, home card, breadcrumb, i18n

- [ ] **6.1** In `src/components/app-sidebar.tsx` (or equivalent): add sidebar entry for "Code tags" / "Campaign codes" with link to `/[locale]/dashboard/code-tags`, icon (e.g. `Tag` or `BarChart2`), active state.
- [ ] **6.2** In `src/components/dashboard/DashboardHomeCards.tsx`: add fourth card for "Code tags" linking to `/[locale]/dashboard/code-tags`, same pattern as Opening Hours, Closings, Messages.
- [ ] **6.3** In `src/components/dashboard/DashboardBreadcrumb.tsx`: add segment for code-tags so breadcrumb shows correctly on the code-tags page.
- [ ] **6.4** i18n: in `src/locales/en.json` (and other locales) add keys under `dashboard.sidebar.codeTags`, `dashboard.breadcrumb.codeTags`, `dashboard.codeTags.*` (title, description, empty state, table headers, etc.).

---

## Phase 7 — Cookie policy and compliance

- [ ] **7.1** Cookie policy page: add **`qr_counted`** under **necessary** (strictly necessary) cookies. Document: Name `qr_counted`, Purpose (remembers which campaign codes already counted so we do not count again on reload within one day), Duration 1 day, Type first-party / strictly necessary.
- [ ] **7.2** Add i18n keys for this cookie (e.g. under `legal.cookies.cookieTypes.necessary` or `necessaryCookies` table) in all locales.
- [ ] **7.3** If the cookie policy has a cookie table, add a row for `qr_counted` in the necessary section.
- [ ] **7.4** Cookie consent / banner: list `qr_counted` under necessary cookies only; make clear necessary cookies are always on and run before acceptance. Ensure **no** consent check gates the API route or the caller.
- [ ] **7.5** If the privacy policy has a cookies or data section that names cookies, add `qr_counted` with same purpose, duration, and note that it is strictly necessary and runs by default.

---

## Phase 8 — Unit tests

- [ ] **8.1** **`src/lib/qr-analytics.ts`**
  - [ ] **8.1.1** `recordQrHit`: with mocked Upstash client, valid code increments the correct key (`qr:count:{code}`); invalid code (wrong length, invalid chars) does not call Redis or throws/returns without incrementing.
  - [ ] **8.1.2** `getQrCounts`: with mocked Redis returning a set of keys/values, returns array of `{ code, count }` with correct shape; empty Redis returns empty array.
- [ ] **8.2** **`src/app/api/analytics/qr/route.ts`**
  - [ ] **8.2.1** GET with no `code` or invalid `code` → 400 (or 422).
  - [ ] **8.2.2** GET with valid `code` and **no** `qr_counted` cookie → calls `recordQrHit`, response has `Set-Cookie` for `qr_counted` with value containing the code and `max-age=86400` (or equivalent).
  - [ ] **8.2.3** GET with valid `code` and `qr_counted` cookie **already containing** that code → does **not** call `recordQrHit`, response does **not** set cookie (or sets same value); status 200.
  - [ ] **8.2.4** GET with valid `code` and `qr_counted` containing another code → calls `recordQrHit`, sets cookie with both codes.
- [ ] **8.3** **`src/app/api/dashboard/code-tags/route.ts`**
  - [ ] **8.3.1** Unauthenticated request → 401.
  - [ ] **8.3.2** Authenticated request → 200, body `{ codes: [...] }`; with mocked `getQrCounts` returning e.g. `[{ code: 'DEMO', count: 5 }]`, response matches.

---

## Phase 9 — E2E tests

Use Playwright in `tests/e2e/`. Base URL e.g. `http://localhost:3000`. Ensure app is running and (for dashboard tests) auth is available (or use test auth / fixture).

- [ ] **9.1** **Full flow: scan → landing → count → dashboard**
  - [ ] **9.1.1** Open a clean context (no `qr_counted` cookie). Navigate to `/{locale}/?qr=DEMO` (e.g. `/en?qr=DEMO`).
  - [ ] **9.1.2** Wait for the page to load and for the analytics API to be called (e.g. wait for network request to `/api/analytics/qr?code=DEMO`).
  - [ ] **9.1.3** Log in as dashboard admin (or use test session). Navigate to `/{locale}/dashboard/code-tags`.
  - [ ] **9.1.4** Assert that the list shows code `DEMO` with count ≥ 1 (e.g. table or card contains "DEMO" and a number).
- [ ] **9.2** **Cookie dedupe: same code again within “session” (cookie set)**
  - [ ] **9.2.1** From same browser context (cookie `qr_counted` now set with DEMO), navigate again to `/{locale}/?qr=DEMO`.
  - [ ] **9.2.2** Optionally: intercept or count requests to `/api/analytics/qr`; second request should still happen but server should **not** increment (cookie present). Verify in dashboard: count for DEMO did **not** increase after the second visit (compare before/after or assert count still equals previous value).
- [ ] **9.3** **Different code increments separately**
  - [ ] **9.3.1** In a **new** context (or clear cookies), navigate to `/{locale}/?qr=BT26`.
  - [ ] **9.3.2** Open dashboard code-tags; assert BT26 appears with count ≥ 1. Optionally assert DEMO still has its previous count (if same test run).
- [ ] **9.4** **Cookie 1-day behaviour (optional, if feasible)**
  - [ ] **9.4.1** After setting `qr_counted=DEMO` with short maxAge in test, or by mocking time: reload with `?qr=DEMO` and assert no second increment. Then either clear cookie or advance time and assert that a new visit with `?qr=DEMO` does increment again. (Can be a separate test with fake time/cookie if Playwright supports.)
- [ ] **9.5** **Dashboard code-tags page**
  - [ ] **9.5.1** Unauthenticated: visit `/{locale}/dashboard/code-tags` → redirect to login or 401.
  - [ ] **9.5.2** Authenticated: visit `/{locale}/dashboard/code-tags` → page loads, title/heading visible, table or list visible (empty or with data).
- [ ] **9.6** **Rate limiting / React Query (optional)**
  - [ ] **9.6.1** On code-tags dashboard page, assert that repeated navigation to the page or focus does not trigger excessive requests to `/api/dashboard/code-tags` (e.g. at most one per 60s or similar, depending on staleTime). Can check network tab or request count.

---

## Phase 10 — Final checks

- [ ] **10.1** Middleware: confirm **no** QR-specific logic and **no** Redis/cookie for `qr` in middleware (middleware stays light).
- [ ] **10.2** Cookie consent: confirm the QR record API and `qr_counted` cookie are **not** gated on consent; cookie policy and banner list `qr_counted` as necessary, always on.
- [ ] **10.3** Run full test suite: `npm run test`, `npm run test:e2e` (with app running). Fix any regressions.
- [ ] **10.4** Manual smoke: open `/?qr=DEMO`, open dashboard code-tags, confirm DEMO appears with count; reload `/?qr=DEMO`, confirm count does not increase; try another code and confirm it appears and increments.

---

## File checklist (reference)

| #   | Item                   | Path / note                                                                                                                                             |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Recording lib          | `src/lib/qr-analytics.ts`                                                                                                                               |
| 2   | API route (record hit) | `src/app/api/analytics/qr/route.ts`                                                                                                                     |
| 3   | Caller component       | Client (or server) component on landing pages calling API when `searchParams.qr` present                                                                |
| 4   | React Query provider   | `QueryClientProvider` in dashboard (or root) layout                                                                                                     |
| 5   | Dashboard API          | `src/app/api/dashboard/code-tags/route.ts`                                                                                                              |
| 6   | Dashboard page         | `src/app/[locale]/(dashboard)/dashboard/code-tags/page.tsx`                                                                                             |
| 7   | View component         | `src/components/dashboard/CodeTagsView.tsx`                                                                                                             |
| 8   | Sidebar entry          | `src/components/app-sidebar.tsx`                                                                                                                        |
| 9   | Home card              | `src/components/dashboard/DashboardHomeCards.tsx`                                                                                                       |
| 10  | Breadcrumb             | `src/components/dashboard/DashboardBreadcrumb.tsx`                                                                                                      |
| 11  | i18n                   | `src/locales/*.json` — dashboard + cookie policy keys                                                                                                   |
| 12  | Cookie policy          | Cookie policy page + i18n + banner (necessary cookie `qr_counted`)                                                                                      |
| 13  | Unit tests             | `src/lib/__tests__/qr-analytics.test.ts`, `src/app/api/analytics/qr/__tests__/route.test.ts`, `src/app/api/dashboard/code-tags/__tests__/route.test.ts` |
| 14  | E2E tests              | `tests/e2e/code-tags.spec.ts` (or similar)                                                                                                              |

---

## Test summary

| Type     | Scope                                                                                                                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit** | `recordQrHit` validation and Redis interaction; `getQrCounts` shape; API route `/api/analytics/qr` (cookie present/absent, Set-Cookie); dashboard API auth and response shape.                                       |
| **E2E**  | Full flow: land with `?qr=DEMO` → API called → dashboard shows increment; cookie dedupe (same code no double count); different code increments; dashboard page auth and render; optional rate limit / request count. |

Implement phases in order; tick off each box as done. Run unit tests after Phase 8, E2E after Phase 9, and Phase 10 before considering the feature complete.

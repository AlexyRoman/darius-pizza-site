# Code Tags Analytics — Architecture

Architecture for **counting** how many times people access the site via a code tag (**direct `?qr=XXXX` only**), where to store counts, and how to show them in the admin dashboard.

**Implementation:** For a step-by-step plan with tickboxes, unit tests, and E2E tests, see [08-code-tags-implementation-plan.md](./08-code-tags-implementation-plan.md).

---

## 1. Goal

- **Count** each "landing" where a user arrives with a `qr` code via **direct URL** (e.g. `https://yoursite.com/?qr=DEMO` or `https://yoursite.com/en?qr=DEMO`). There is **no** `/q/XXXX` path or redirect; all code-tag traffic uses the `qr` query parameter.
- **Store** counts per code (e.g. `DEMO`, `BT26`) in **Upstash** (Redis) for reporting. Counting and storage are required, not optional.
- **Display** codes and hit counts in the admin dashboard with a dedicated page and component.
- Optionally send events to an external system in addition to Upstash (e.g. webhook for backup/analytics).

### 1.1 Access model (direct `?qr=XXXX` only)

- **Entry:** Users reach the site with a code tag by opening a URL that includes the `qr` query parameter, e.g. `https://yoursite.com/?qr=DEMO` or `https://yoursite.com/en?qr=BT26`.
- **No `/q/XXXX` path:** There is no short path like `/q/DEMO` and no server redirect. QR codes and links must point directly at the final URL with `?qr=XXXX`.
- **Counting:** When the user lands on `/` or `/{locale}` with `?qr=XXXX`, a **client or server component** calls an **API route** (e.g. `GET /api/analytics/qr?code=DEMO`). The API route records the hit in Upstash and sets the dedupe cookie. **Middleware is not used** for this — we keep middleware light (see §2 and §4.1).

---

## 2. When to Count (and where)

| Moment                                                      | Where it happens                                                                   | Pros                                                                                                 | Cons                                                                                                                                         |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Middleware** (on doc request with `qr`)                | Middleware runs `recordQrHit` + sets cookie                                        | Server-side, no ad-blocker                                                                           | **Heavy for middleware:** Redis round-trip on every landing; middleware should stay light (redirects, auth, locale only).                    |
| **B. API route** (page loads, then client/server calls API) | Client or server component sees `qr`, calls e.g. `GET /api/analytics/qr?code=DEMO` | **Middleware stays light.** All analytics logic in one place (API). Cookie read/set on API response. | Count only when the API is called (needs JS for client call, or server component for server call). Ad-blockers may block `/api/analytics/*`. |
| **C. Dedicated beacon**                                     | Page loads; pixel or script hits API with `qr`                                     | Can be 1x per landing                                                                                | Same as B for “who does the work”; beacon is just another way to call the API.                                                               |

**Recommendation:** **B — API route.** Keep **middleware light**: no Redis, no analytics logic there. When the user lands with `?qr=XXXX`, the page (client component or server component) calls `GET /api/analytics/qr?code=XXXX`. The API route: reads the `qr_counted` cookie from the request; if this code is already in the cookie, returns without incrementing; otherwise runs `recordQrHit(code)` (Upstash INCR) and sets the `qr_counted` cookie on the **API response**. Deduplication is the same (1-day cookie); only the place that reads/sets it moves from middleware to the API route. Trade-off: counting depends on the API being called (JS for client, or server component). For a typical Next.js app and QR campaign use case, this is acceptable and keeps the architecture simple.

### 2.1 Deduplication: cookie "already counted" (1 day)

To prevent counting again when the user **reloads** the page or returns within a day, use a **cookie**. The **API route** reads the request’s `Cookie` header and sets `Set-Cookie` on the API response (no middleware involved).

| Choice             | Use here? | Reason                                                                                                                                                                            |
| ------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cookie**         | **Yes**   | The API route can read the request’s `Cookie` header and set `Set-Cookie` on the API response. One cookie stores "codes we already counted for this visitor" with a 1-day expiry. |
| **localStorage**   | No        | Not sent to the server; API cannot see it on first request. Cookie is simpler and works with API-based counting.                                                                  |
| **sessionStorage** | No        | Same as above.                                                                                                                                                                    |

**Cookie design:**

- **Name:** e.g. `qr_counted`.
- **Value:** Codes for which we have already recorded a hit for this visitor, e.g. `DEMO` or `DEMO,BT26` (comma-separated; keep list small or cap length).
- **Duration:** **1 day** — `Max-Age=86400` (seconds). After that, the cookie expires and a new visit with `?qr=XXXX` will count again.
- **Path:** `/` so it applies site-wide.
- **SameSite:** `Lax` (default). **HttpOnly:** recommended so only the server can read/write it.
- **Strictly necessary / core:** This cookie is **not** subject to cookie consent. It runs **by default, before** any cookie acceptance. The API route must **never** check consent before reading or setting `qr_counted` — it is a pure core cookie for deduplication only (no tracking, no advertising). List it under **necessary** in the cookie policy and in the consent banner so users see it is always active.

**Flow (API-route approach):**

1. User lands: `GET /?qr=DEMO` (or `/{locale}?qr=DEMO`). Document is served; **middleware does nothing** for `qr`.
2. Page (client or server component) sees `qr=DEMO` and calls `GET /api/analytics/qr?code=DEMO` (or POST with body `{ code: 'DEMO' }`).
3. API route reads `Cookie` header; parses `qr_counted`. If `DEMO` is already in the list → return 200 without incrementing, no `Set-Cookie` needed.
4. If `DEMO` is **not** in the list → call `recordQrHit(code)` (Upstash INCR); then set `Set-Cookie: qr_counted=...` on the **API response** with `maxAge: 86400`, `path: '/'`.
5. Reloads and revisits within 1 day: browser sends the cookie to the API; API sees `DEMO` in `qr_counted`, skips recording.

**Implementation note:** In the API route handler, use `cookies().set('qr_counted', newValue, { maxAge: 86400, path: '/' })` (or the equivalent in your framework) when you have just recorded a hit. Append the new code to any existing value; optionally cap the list (e.g. last 10 codes) to avoid a huge cookie.

### 2.2 Cookie policy and compliance

The cookie **`qr_counted`** is new; it must be documented in the site’s **cookie policy** and in the cookie consent flow as a **strictly necessary / core** cookie that runs **by default before** any cookie acceptance.

- **Runs before consent:** **`qr_counted`** is a **pure core cookie**. The API route must **not** check cookie consent before reading or setting it — it runs by default. No consent is required; it is used only for deduplication (avoiding double-count on reload), not for tracking or advertising. Ensure the caller (landing page) invokes the API and the API sets the cookie regardless of banner state.
- **Cookie policy page** (e.g. `/[locale]/cookies` using `CookiesContent.tsx` and `legal.cookies` i18n):
  - Add **`qr_counted`** under **necessary** (strictly necessary / core cookies), **not** under functional or analytics.
  - Document: **Name** `qr_counted`, **Purpose** “Remembers which campaign codes we have already counted for your visit so we do not count again on reload or revisit within one day (core functionality)”, **Duration** 1 day, **Type** first-party / strictly necessary.
  - Add i18n keys under `legal.cookies.cookieTypes.necessary` (or a “necessaryCookies” table that includes `qr_counted`) so all locales stay in sync. If the policy uses a **cookie table**, add a row for `qr_counted` in the necessary section.
- **Cookie consent / banner** (e.g. `gdpr-cookie-consent`, `cookie-consent-banner`):
  - List **`qr_counted`** under **necessary** cookies only. Make clear that necessary cookies are always active and run **before** acceptance; they are not toggleable. Do **not** gate the QR record API or the setting of `qr_counted` on user acceptance.
- **Privacy policy / legal**:
  - If the privacy policy has a “Cookies” or “Data we collect” section that names cookies, add **`qr_counted`** there with the same purpose, duration, and note that it is strictly necessary and runs by default.

**Checklist:** Document `qr_counted` as **necessary** in cookie policy and i18n → add to necessary cookie table/list → in banner, list under necessary (always on, before acceptance) → do **not** add consent checks around setting/reading this cookie → mention in privacy policy if applicable.

---

## 3. Storage Options

### 3.1 Upstash (Redis / KV) — **we use this**

- **Already in use** for hours, closings, messages.
- **Use for:** Counters (`INCR qr:count:{code}`) and optional server-side dedupe keys (`SET qr:seen:{code}:{fingerprint} 1 EX 600`).
- **Limitations:** No built-in "list all codes with counts" unless you use `SCAN` or maintain a set of code keys; no time-series by default (you'd add that yourself, e.g. `HINCRBY qr:DEMO 2025-02-14 1` if you want daily breakdown).
- **Decision:** **We use Upstash** for code-tag counts. Every recorded hit is stored there. Optionally `POST` to an external URL from the same place you increment (non-blocking).

### 3.2 "Post to external" (e.g. ipstash or other)

- If **ipstash** (or similar) is an external HTTP API that accepts events:
  - From the API route (when the landing is recorded), **POST** a small payload: `{ code, timestamp, [optional: fingerprint, path] }`.
  - The external system owns storage and aggregation; your app only sends events.
- **Verdict:** **Good** if you already have that endpoint and want analytics outside the app. Can run **in addition** to local counts (e.g. Upstash): increment locally and fire-and-forget POST to external.

### 3.3 Supabase (post-migration)

- **Table** e.g. `qr_hits(id, code, created_at)` or `qr_daily(code, date, count)`.
- **Pros:** SQL queries, dashboard can filter by date/code; fits with existing migration plan.
- **Cons:** Requires migration and new table; slightly more work than Redis INCR.
- **Verdict:** **Good** medium-term: one place for dashboard data and reporting. Can be added when Supabase is the primary backend.

### 3.4 What we do (short term)

1. **Count store:** **Upstash Redis** — `INCR qr:count:{code}` on each counted request. Cookie dedupe (see §2.1) avoids re-count on reload; optional Redis dedupe as backstop.
2. **Optional:** POST to an external endpoint for backup/analytics; non-blocking (e.g. `fetch(url, { method: 'POST', body: JSON.stringify({ code, ts }) })` in API route, no await in critical path).
3. **Later:** Add Supabase `qr_hits` or `qr_daily` and optionally backfill or switch to Supabase as source of truth for the dashboard.

---

## 4. Implementation Sketch

### 4.1 Counting: API route (recommended), not middleware

**Principle: keep middleware light.** Middleware should handle redirects, locale, auth — not Redis or analytics. Putting `recordQrHit` (Upstash round-trip) in middleware adds latency to every landing with `?qr=` and mixes concerns.

- **Recommended — API route:**
  - When the user lands on `/` or `/{locale}` with `?qr=XXXX`, the **page** (client component or server component) calls `GET /api/analytics/qr?code=XXXX` (or `POST /api/analytics/qr` with body `{ code }`).
  - The **API route** (e.g. `src/app/api/analytics/qr/route.ts`): (1) reads `qr_counted` cookie from the request; (2) if code is already in the cookie, returns without doing anything; (3) otherwise calls `recordQrHit(code)` (Upstash INCR + optional external POST), then sets `qr_counted` cookie on the response with `maxAge: 86400`, `path: '/'`. **Do not** check cookie consent in this route — `qr_counted` is a strictly necessary cookie and runs by default before acceptance (§2.1, §2.2).
  - **Middleware:** does **not** run any QR analytics logic; no change to middleware for this feature.
  - **Trade-off:** Counting happens only when the API is invoked (client needs JS, or use a server component that calls the API / runs server-side fetch). For a Next.js app and QR campaign codes, this is acceptable; we gain a simple, light middleware and a single place (API route) for all analytics logic.

- **Alternative — Middleware (not recommended):**  
  Middleware could read the cookie and call `recordQrHit` + set cookie on the document response. This would work without JS but adds a Redis round-trip to the critical path of every landing with `?qr=`, which goes against keeping middleware light. Only consider if you must count when JS is disabled and you accept heavier middleware.

### 4.2 Recording module (new)

- **File:** e.g. `src/lib/qr-analytics.ts` (or `src/lib/code-tag-analytics.ts`).
- **Functions:**
  - `recordQrHit(code: string, request?: Request): Promise<void>`
    - Validates `code` (4 alphanumeric).
    - **Primary dedupe is in the API route** via cookie `qr_counted` (1 day) — the API only calls this when the code is not in the cookie. Optional backstop: build fingerprint from request, check Redis `qr:seen:{code}:{fp}`; if set, return; else set with TTL and continue.
    - **`INCR qr:count:{code}` in Upstash** (required for every recorded hit).
    - Optionally enqueue or call external POST (non-blocking).
  - `getQrCounts(): Promise<{ code: string; count: number }[]>`
    - Used by dashboard API: e.g. `SCAN` for keys `qr:count:*` and return list with counts, or maintain a set `qr:codes` and `MGET` each.
- **Config:** Reuse existing Upstash env for Redis. Optional: `QR_ANALYTICS_EXTERNAL_URL` for external POST; counting/storage in Upstash is always on when `qr` is present on a landing request.

### 4.3 No middleware change for QR analytics

- **Middleware** is left unchanged for this feature. No QR-specific logic, no Redis calls, no cookie read/write in middleware. Code-tag access is **only** via `?qr=XXXX` on the canonical URL; there is no `/q/XXXX` route.
- All recording and cookie handling happens in the **API route** and in the **page** (or component) that calls that API when `qr` is present in the URL.

### 4.4 External POST (ipstash or other)

- If the only external architecture you have is "ipstash":
  - Treat it as an **HTTP endpoint** that accepts a POST body, e.g. `{ "code": "DEMO", "timestamp": "2025-02-14T12:00:00Z" }`.
  - From `recordQrHit` (or from the API route that it triggers), send that payload.
  - **Whether it's "good":** It's good **if** it gives you durable storage and a way to query counts/events. If ipstash is just a key-value or queue, you can still use it to aggregate elsewhere; document the contract (payload + response) in this doc or in `docs/dashboard-analysis/` so the dashboard can eventually read from the same source if needed.

---

## 5. Dashboard: Display of Codes and Counts

### 5.1 UX goal

- Admin sees **all known codes** (that have at least one hit) and their **total hit count**.
- Optional: table with columns Code, Count, Last seen (if you store last hit time).

### 5.2 Route and layout

- **New route:** `[locale]/(dashboard)/dashboard/code-tags/page.tsx` (or `campaign-codes`).
- **Layout:** Reuse existing dashboard layout (sidebar + breadcrumb); no change to `dashboard/layout.tsx` except ensuring the new page is under the same layout.

### 5.3 Sidebar

- **Location:** Under the existing "Settings" collapsible, next to Opening Hours, Closings, Messages (or as a separate top-level item if you prefer "Analytics").
- **Label:** e.g. "Code tags" or "Campaign codes".
- **Icon:** e.g. `Tag` or `BarChart2` from `lucide-react`.
- **i18n:** Add keys under `dashboard.sidebar` (e.g. `codeTags`) and `dashboard.breadcrumb` (e.g. `codeTags`).

### 5.4 New component: `CodeTagsView` (or `CampaignCodesView`)

- **Responsibility:** Fetch and display list of codes with counts.
- **Data:** From a new API route, e.g. `GET /api/dashboard/code-tags` (or `/api/analytics/code-tags`), protected by existing dashboard auth (session/cookie). The API calls `getQrCounts()` from the recording module (Upstash) or, later, Supabase.
- **Tech:** **Client Component** using **React Query** (`useQuery`) to fetch the API — see §6 for query key, rate-limiting options (staleTime, refetchInterval), and optional pacer-wrapped manual refresh.
- **UI:**
  - **Header:** Title "Code tags" / "Campaign codes", short description (e.g. "Hits per short link code"), optional **Refresh** button (throttled via pacer so rapid clicks don't spam the API).
  - **Table (or card list):** Columns: Code, Count, optionally "Last used". Sort by count descending.
  - **Empty state:** If no codes yet, show a message and optionally the link format (`?qr=XXXX`).
  - **Optional:** Copyable link per code (e.g. `https://yoursite.com/?qr=DEMO` or `https://yoursite.com/en?qr=DEMO`).
- Use existing UI primitives (`Table`, `Card`, etc.) for consistency with Opening Hours / Closings / Messages.

### 5.5 Dashboard home card

- Add a **fourth card** on the dashboard home (`DashboardHomeCards`) for "Code tags" / "Campaign codes" linking to `/[locale]/dashboard/code-tags`, same pattern as Opening Hours, Closings, Messages (icon + title + description).

### 5.6 API route (dashboard)

- **Route:** `src/app/api/dashboard/code-tags/route.ts` (or under `api/analytics/`).
- **Method:** GET.
- **Auth:** Ensure only authenticated dashboard users can call it (same as other dashboard APIs).
- **Response:** `{ codes: { code: string; count: number }[] }` (and optionally `lastSeen` per code if stored).
- **Implementation:** Call `getQrCounts()` from `src/lib/qr-analytics.ts` and return JSON.

### 5.7 File checklist (dashboard + analytics)

| Piece                   | Location                                                                                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Recording lib           | `src/lib/qr-analytics.ts`                                                                                                                                                                                                                                     |
| API route (record hit)  | `src/app/api/analytics/qr/route.ts` (GET or POST: read `qr_counted` cookie; if code not in cookie, call `recordQrHit` and set `qr_counted` on response with 1-day maxAge). **Do not check consent** — core cookie, runs by default. **No middleware change.** |
| Caller (page/component) | Client or server component on landing pages: when `searchParams.qr` is present, call the API (prefer React Query: `useQuery` with `staleTime: Infinity`, `retry: false` so it fires once).                                                                    |
| Dashboard API           | `src/app/api/dashboard/code-tags/route.ts`                                                                                                                                                                                                                    |
| Dashboard page          | `src/app/[locale]/(dashboard)/dashboard/code-tags/page.tsx`                                                                                                                                                                                                   |
| View component          | `src/components/dashboard/CodeTagsView.tsx` (or `CampaignCodesView.tsx`) — uses React Query `useQuery`, see §6                                                                                                                                                |
| React Query provider    | Add `QueryClientProvider` (e.g. dashboard or root layout) so **all** API calls use React Query for rate limiting and good practices (§6).                                                                                                                     |
| Cookie policy & i18n    | Document `qr_counted` as **necessary** (runs before acceptance). Cookie policy + i18n under `legal.cookies.cookieTypes.necessary`; banner: list as always-on; **no consent check** in API (§2.2).                                                             |
| Sidebar entry           | `src/components/app-sidebar.tsx` (link + icon + active state)                                                                                                                                                                                                 |
| Home card               | `src/components/dashboard/DashboardHomeCards.tsx` (new card)                                                                                                                                                                                                  |
| Breadcrumb              | `src/components/dashboard/DashboardBreadcrumb.tsx` (add code-tags segment if needed)                                                                                                                                                                          |
| i18n                    | `src/locales/en.json` (and other locales): `dashboard.sidebar.codeTags`, `dashboard.breadcrumb.codeTags`, `dashboard.codeTags.*`                                                                                                                              |

---

## 6. React Query for API calls and rate limiting

Use **React Query** for **all** dashboard API calls (and, where appropriate, for the public-facing QR record call) to get consistent **caching**, **rate limiting**, and good practices (deduplication, retries, loading/error states). The project already has **@tanstack/react-query**; wire it once and use it everywhere.

### 6.1 React Query setup (if not already done)

- **Provider:** Add `QueryClientProvider` from `@tanstack/react-query` where client components can use it. Recommended: a small `src/providers/QueryProvider.tsx` that creates a `QueryClient` and wraps `children`, then use it in the **dashboard layout** (e.g. `src/app/[locale]/(dashboard)/dashboard/layout.tsx`). Alternatively wrap the root layout so both dashboard and any public pages that call APIs can use `useQuery` / `useMutation`.
- **QueryClient defaults:** Set sensible defaults for **staleTime**, **gcTime**, **retry**, and **refetchOnWindowFocus** so all API calls benefit: e.g. `staleTime: 60_000`, `refetchOnWindowFocus: false`, `retry: 1`. Override per-query where needed (e.g. code-tags list can have longer `staleTime`).

### 6.2 Use React Query for all dashboard API calls

- **Dashboard data (GET):** Use **`useQuery`** for every dashboard API that fetches data (code-tags, opening hours, closings, messages, etc.). Same pattern: stable `queryKey`, `queryFn` that calls the API, and options for rate limiting (`staleTime`, `refetchInterval`, `refetchOnWindowFocus`). This avoids duplicate requests, limits how often APIs are hit, and gives consistent loading/error handling.
- **Dashboard mutations (POST/PUT/DELETE):** Use **`useMutation`** for actions that change data; invalidate the relevant `queryKey` on success (e.g. `queryClient.invalidateQueries({ queryKey: ['dashboard', 'code-tags'] })`) so the list refetches when needed. Use **pacer** (`withThrottle` / `withRateLimit`) on submit buttons to avoid double submissions.
- **Public-facing QR record call:** When the landing page (client component) calls `GET /api/analytics/qr?code=XXXX`, either: (a) **one-off fetch** in `useEffect` with a ref to ensure it runs only once per mount, or (b) **`useQuery`** with `queryKey: ['qr-record', code]`, `staleTime: Infinity`, `gcTime: 0`, `enabled: !!code`, and `retry: false` so it fires once and is not refetched. Option (b) keeps all API calls under React Query for consistency and avoids accidental double-fires.

### 6.3 Code-tags query: rate limiting via React Query options

Use **`useQuery`** in `CodeTagsView` to fetch `GET /api/dashboard/code-tags` with options that limit how often the API is hit:

| Option                   | Recommended value                     | Purpose                                                                                                    |
| ------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **queryKey**             | `['dashboard', 'code-tags']`          | Stable key so cache is reused.                                                                             |
| **staleTime**            | `60_000`–`120_000` (1–2 min)          | Data is considered fresh for this period; no refetch on mount/focus if still fresh.                        |
| **refetchInterval**      | `false` or `120_000` (2 min)          | No background polling, or moderate polling so the list updates without user action.                        |
| **refetchOnWindowFocus** | `false` or `true` with long staleTime | Avoid refetch every time the admin switches tabs; if `true`, staleTime ensures we don't refetch too often. |
| **refetchOnMount**       | `true` (default)                      | First load and when navigating back to the page get fresh data, but still respect staleTime.               |

Example (conceptual):

```ts
useQuery({
  queryKey: ['dashboard', 'code-tags'],
  queryFn: () => fetch('/api/dashboard/code-tags').then(r => r.json()),
  staleTime: 60_000, // 1 min — rate limit refetches
  refetchInterval: 120_000, // optional: poll every 2 min, or false for manual only
  refetchOnWindowFocus: false,
});
```

This gives **client-side rate limiting**: the API is not called more than once per minute (or per 2 min if using refetchInterval) for this view, and not on every tab focus.

### 6.4 Manual refresh with pacer (optional)

If you add a **Refresh** button that calls `refetch()`:

- Wrap the refetch call with **`withThrottle`** or **`withRateLimit`** from `src/lib/pacer.ts` so rapid clicks do not trigger multiple requests (e.g. throttle 2–3 s, or schedule via `uiPacer`).
- Example: `const throttledRefetch = useCallback(withThrottle(() => refetch(), 2000), [refetch]);` and pass `throttledRefetch` to the button's `onClick`.

### 6.5 Server-side rate limiting (optional)

- **GET /api/dashboard/code-tags:** Optional per-user or per-session rate limit (e.g. max N requests per minute) to protect Redis/Upstash and avoid abuse. Can reuse the same pattern as `src/app/api/auth/authenticate/route.ts` (in-memory map by IP or by session id) or a small shared helper; document in this section if added.
- **Recording (recordQrHit):** Already "rate limited" by the fact that each landing is one request; if you add an explicit cap (e.g. per IP per code per minute), do it inside `recordQrHit` or in middleware before calling it (e.g. check Redis key `qr:ratelimit:{ip}:{code}` with TTL 60s).

### 6.6 Summary (React Query + rate limiting)

| Layer                       | Mechanism                                                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Client (React Query)**    | `staleTime`, `refetchInterval`, `refetchOnWindowFocus: false` so code-tags API is not hit too often.                       |
| **Client (manual refresh)** | Throttle or rate-limit the Refresh button with `withThrottle` / `withRateLimit` from `src/lib/pacer.ts`.                   |
| **Server (dashboard API)**  | Optional: rate limit GET /api/dashboard/code-tags per user/session.                                                        |
| **Server (recording)**      | Primary: cookie `qr_counted` (1 day) prevents re-count on reload/same visitor. Optional: Redis or IP+code cap as backstop. |

---

## 7. Is "ipstash" Good for This?

- **We use Upstash (Redis)** for counts — required. Optionally also POST to another system for backup.
- If **ipstash** = **external HTTP API:** Good as an additional destination: app sends events there; that system can store and aggregate. Use Upstash (or Supabase) for the dashboard's own "list of codes and counts" unless ipstash exposes an API the dashboard can call.
- If you only have **one** place (ipstash): use it for both recording and, if it supports querying, for the dashboard; document the exact API (payload + how to read counts) so the dashboard component and API route can be implemented against it.

---

## 8. Summary

| Area              | Decision                                                                                                                                                                                                                                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **When to count** | **API route**: when the page has `qr` on the URL, a component calls `GET /api/analytics/qr?code=XXXX`. **Middleware is not used** (kept light). Access is direct via `?qr=XXXX` only; no `/q/XXXX` redirect.                                                                                                                        |
| **Deduplication** | **Cookie `qr_counted`** (1 day): the API route reads it before recording; if the code is already in the cookie, skip. When we do count, set the cookie on the API response so reloads/revisits within 1 day do not count again. See §2.1.                                                                                           |
| **Cookie policy** | **`qr_counted`** is a **strictly necessary** cookie: runs **by default before** cookie acceptance; do not gate on consent. Document under **necessary** in cookie policy and i18n; list in banner as always-on. See §2.1, §2.2.                                                                                                     |
| **Storage**       | **Upstash Redis** for counts (required). Cookie dedupe + optional Redis backstop. Optional: POST to external.                                                                                                                                                                                                                       |
| **Display**       | New dashboard page `dashboard/code-tags`, new component `CodeTagsView`, new API `GET /api/dashboard/code-tags`, sidebar + home card + i18n.                                                                                                                                                                                         |
| **React Query**   | Use React Query for **all** API calls: dashboard data via `useQuery` (rate limiting via `staleTime` / `refetchInterval` / `refetchOnWindowFocus`), mutations via `useMutation` with invalidation; optional `useQuery` for the public QR record call to avoid double-fires. Add `QueryClientProvider` in dashboard (or root) layout. |
| **Rate limiting** | Client: React Query options + optional pacer (`withThrottle`/`withRateLimit`) on manual Refresh. Server: optional rate limit on dashboard API and on recording.                                                                                                                                                                     |
| **External**      | Use "ipstash" (or similar) as optional event sink; keep app's source of truth for the dashboard in Redis or Supabase so the new component can list codes and counts without depending on external API.                                                                                                                              |

This gives you a clear path from "landing with `?qr=XXXX`" to "count stored in Upstash" to "display in admin dashboard", with optional external post and controlled request rate via React Query and pacer.

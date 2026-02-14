# Code Tags Analytics — Architecture

Architecture for **counting** how many times people access the site via a code tag (`/q/XXXX` → `?qr=XXXX`), where to store counts, and how to show them in the admin dashboard.

---

## 1. Goal

- **Count** each “landing” where a user arrives with a `qr` code (either via `/q/XXXX` redirect or direct `?qr=XXXX`).
- **Store** counts per code (e.g. `DEMO`, `BT26`) for reporting.
- **Optionally** send data to an external system (e.g. Upstash, or another analytics endpoint).
- **Display** codes and hit counts in the admin dashboard with a dedicated page and component.

---

## 2. When to Count

| Moment                                                                   | Where it happens                                                   | Pros                                                    | Cons                                                                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **A. After redirect** (request to `/` or `/{locale}` with `qr` in query) | Middleware or API called from first document request               | Server-side, no ad-blocker issues for the count request | Must avoid double-counting same visit (e.g. same IP+code+short window) if we count every request |
| **B. Client-side on load**                                               | Client component reads `qr` from URL and calls API                 | Full control over “one count per page view”             | Can be blocked; no count if JS disabled                                                          |
| **C. Dedicated beacon**                                                  | Redirect target loads; a small API route or pixel is hit with `qr` | Can be 1x per landing if designed that way              | Needs care to avoid double-count (e.g. middleware + client both firing)                          |

**Recommendation:** **A — count in middleware** when the request has `qr` in the query string and path is the app root or a locale root. One increment per request; optionally **deduplicate** by a short-lived key (e.g. `qr:DEMO:{fingerprint}` in Redis with TTL 5–15 min) so one user session doesn’t inflate counts on refresh. If you prefer simplicity over perfect deduplication, skip dedupe and count every request with `qr`.

---

## 3. Storage Options

### 3.1 Upstash (Redis / KV)

- **Already in use** for hours, closings, messages.
- **Good for:** Fast counters (`INCR qr:count:DEMO`), optional dedupe keys (`SET qr:seen:DEMO:{fingerprint} 1 EX 600`).
- **Limitations:** No built-in “list all codes with counts” unless you use `SCAN` or maintain a set of code keys; no time-series by default (you’d add that yourself, e.g. `HINCRBY qr:DEMO 2025-02-14 1` if you want daily breakdown).
- **Verdict:** **Good** for a first version: minimal code, no new infra. Use Redis `INCR` per code; optionally `POST` to an external URL (e.g. webhook) from the same place you increment.

### 3.2 “Post to external” (e.g. ipstash or other)

- If **ipstash** (or similar) is an external HTTP API that accepts events:
  - From middleware (or from an API route called after redirect), **POST** a small payload: `{ code, timestamp, [optional: fingerprint, path] }`.
  - The external system owns storage and aggregation; your app only sends events.
- **Verdict:** **Good** if you already have that endpoint and want analytics outside the app. Can run **in addition** to local counts (e.g. Upstash): increment locally and fire-and-forget POST to external.

### 3.3 Supabase (post-migration)

- **Table** e.g. `qr_hits(id, code, created_at)` or `qr_daily(code, date, count)`.
- **Pros:** SQL queries, dashboard can filter by date/code; fits with existing migration plan.
- **Cons:** Requires migration and new table; slightly more work than Redis INCR.
- **Verdict:** **Good** medium-term: one place for dashboard data and reporting. Can be added when Supabase is the primary backend.

### 3.4 Recommended hybrid (short term)

1. **Primary count store:** Upstash Redis — `INCR qr:count:{code}` on each counted request (with optional dedupe).
2. **Optional:** POST to external (ipstash or other) for backup/analytics; non-blocking (e.g. `fetch(url, { method: 'POST', body: JSON.stringify({ code, ts }) })` in API route, no await in critical path).
3. **Later:** Add Supabase `qr_hits` or `qr_daily` and optionally backfill or switch to Supabase as source of truth for the dashboard.

---

## 4. Implementation Sketch

### 4.1 Counting (middleware or API)

- **Option M — Middleware:**  
  After locale/static checks, if `pathname` is `/` or `/{locale}` and `searchParams.get('qr')` matches `[A-Za-z0-9]{4}`:
  - Call a small **recording function** (e.g. `recordQrHit(code, request)`).
  - That function: (1) optionally checks dedupe key in Redis; (2) `INCR qr:count:{code}` in Upstash; (3) optionally triggers async POST to external.
  - Middleware must stay fast: do **not** await the external POST; run it in background (e.g. via API route called with `waitUntil` if on Vercel, or fire-and-forget).
- **Option A — API route:**  
  Redirect target page (or a client component) calls `GET /api/analytics/qr?code=DEMO` or `POST /api/analytics/qr` with body `{ code }`. The route does the same: Redis INCR + optional external POST.  
  **Downside:** Count only when client runs JS and the request is not blocked.

**Recommendation:** Option M (middleware) for reliability; keep the recording call lightweight (Redis only in hot path; external POST via background job or `waitUntil`).

### 4.2 Recording module (new)

- **File:** e.g. `src/lib/qr-analytics.ts` (or `src/lib/code-tag-analytics.ts`).
- **Functions:**
  - `recordQrHit(code: string, request?: Request): Promise<void>`
    - Validates `code` (4 alphanumeric).
    - Optional dedupe: build fingerprint from request (e.g. IP + User-Agent hash or header), check Redis `qr:seen:{code}:{fp}`; if set, return; else set with TTL and continue.
    - `INCR qr:count:{code}` in Upstash.
    - Optionally enqueue or call external POST (non-blocking).
  - `getQrCounts(): Promise<{ code: string; count: number }[]>`
    - Used by dashboard API: e.g. `SCAN` for keys `qr:count:*` and return list with counts, or maintain a set `qr:codes` and `MGET` each.
- **Config:** Env vars, e.g. `QR_ANALYTICS_ENABLED`, `QR_ANALYTICS_EXTERNAL_URL` (optional), reuse existing Upstash env for Redis.

### 4.3 Middleware change

- After handling `/q/XXXX` redirect and before serving the page, when the request already has `qr` on a “landing” path:
  - Call `recordQrHit(code)` (or pass `request` for dedupe).
  - Do not block response on external POST.

### 4.4 External POST (ipstash or other)

- If the only external architecture you have is “ipstash”:
  - Treat it as an **HTTP endpoint** that accepts a POST body, e.g. `{ "code": "DEMO", "timestamp": "2025-02-14T12:00:00Z" }`.
  - From `recordQrHit` (or from the API route that it triggers), send that payload.
  - **Whether it’s “good”:** It’s good **if** it gives you durable storage and a way to query counts/events. If ipstash is just a key-value or queue, you can still use it to aggregate elsewhere; document the contract (payload + response) in this doc or in `docs/dashboard-analysis/` so the dashboard can eventually read from the same source if needed.

---

## 5. Dashboard: Display of Codes and Counts

### 5.1 UX goal

- Admin sees **all known codes** (that have at least one hit) and their **total hit count**.
- Optional: table with columns Code, Count, Last seen (if you store last hit time).

### 5.2 Route and layout

- **New route:** `[locale]/(dashboard)/dashboard/code-tags/page.tsx` (or `campaign-codes`).
- **Layout:** Reuse existing dashboard layout (sidebar + breadcrumb); no change to `dashboard/layout.tsx` except ensuring the new page is under the same layout.

### 5.3 Sidebar

- **Location:** Under the existing “Settings” collapsible, next to Opening Hours, Closings, Messages (or as a separate top-level item if you prefer “Analytics”).
- **Label:** e.g. “Code tags” or “Campaign codes”.
- **Icon:** e.g. `Tag` or `BarChart2` from `lucide-react`.
- **i18n:** Add keys under `dashboard.sidebar` (e.g. `codeTags`) and `dashboard.breadcrumb` (e.g. `codeTags`).

### 5.4 New component: `CodeTagsView` (or `CampaignCodesView`)

- **Responsibility:** Fetch and display list of codes with counts.
- **Data:** From a new API route, e.g. `GET /api/dashboard/code-tags` (or `/api/analytics/code-tags`), protected by existing dashboard auth (session/cookie). The API calls `getQrCounts()` from the recording module (Upstash) or, later, Supabase.
- **Tech:** **Client Component** using **React Query** (`useQuery`) to fetch the API — see §6 for query key, rate-limiting options (staleTime, refetchInterval), and optional pacer-wrapped manual refresh.
- **UI:**
  - **Header:** Title “Code tags” / “Campaign codes”, short description (e.g. “Hits per short link code”), optional **Refresh** button (throttled via pacer so rapid clicks don’t spam the API).
  - **Table (or card list):** Columns: Code, Count, optionally “Last used”. Sort by count descending.
  - **Empty state:** If no codes yet, show a message and optionally the short link format (`/q/XXXX`).
  - **Optional:** Copyable short link per code (e.g. `https://yoursite.com/q/DEMO`).
- Use existing UI primitives (`Table`, `Card`, etc.) for consistency with Opening Hours / Closings / Messages.

### 5.5 Dashboard home card

- Add a **fourth card** on the dashboard home (`DashboardHomeCards`) for “Code tags” / “Campaign codes” linking to `/[locale]/dashboard/code-tags`, same pattern as Opening Hours, Closings, Messages (icon + title + description).

### 5.6 API route (dashboard)

- **Route:** `src/app/api/dashboard/code-tags/route.ts` (or under `api/analytics/`).
- **Method:** GET.
- **Auth:** Ensure only authenticated dashboard users can call it (same as other dashboard APIs).
- **Response:** `{ codes: { code: string; count: number }[] }` (and optionally `lastSeen` per code if stored).
- **Implementation:** Call `getQrCounts()` from `src/lib/qr-analytics.ts` and return JSON.

### 5.7 File checklist (dashboard + analytics)

| Piece                  | Location                                                                                                                         |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Recording lib          | `src/lib/qr-analytics.ts`                                                                                                        |
| Middleware integration | `src/middleware.ts` (call `recordQrHit` when `qr` present on landing path)                                                       |
| Dashboard API          | `src/app/api/dashboard/code-tags/route.ts`                                                                                       |
| Dashboard page         | `src/app/[locale]/(dashboard)/dashboard/code-tags/page.tsx`                                                                      |
| View component         | `src/components/dashboard/CodeTagsView.tsx` (or `CampaignCodesView.tsx`) — uses React Query, see §6                              |
| React Query provider   | Add `QueryClientProvider` so dashboard (or app) can use `useQuery` — see §6                                                      |
| Sidebar entry          | `src/components/app-sidebar.tsx` (link + icon + active state)                                                                    |
| Home card              | `src/components/dashboard/DashboardHomeCards.tsx` (new card)                                                                     |
| Breadcrumb             | `src/components/dashboard/DashboardBreadcrumb.tsx` (add code-tags segment if needed)                                             |
| i18n                   | `src/locales/en.json` (and other locales): `dashboard.sidebar.codeTags`, `dashboard.breadcrumb.codeTags`, `dashboard.codeTags.*` |

---

## 6. React Query and rate limiting

The dashboard already has **@tanstack/react-query** in the project; it is not yet wired (no `QueryClientProvider`). For code-tags analytics we integrate React Query for the Code Tags view and apply rate limiting so the dashboard does not hammer the API.

### 6.1 React Query setup (if not already done)

- **Provider:** Add `QueryClientProvider` from `@tanstack/react-query` where client components can use it. Recommended: a small `src/components/providers/QueryProvider.tsx` that creates a `QueryClient` and wraps `children`, then use it in the **dashboard layout** (e.g. `src/app/[locale]/(dashboard)/dashboard/layout.tsx`) so only dashboard pages need React Query for now. Alternatively wrap the root layout if you plan to use React Query elsewhere.
- **QueryClient defaults (optional):** You can set default `staleTime` / `gcTime` on the client to avoid unnecessary refetches app-wide; for code-tags we override per-query.

### 6.2 Code-tags query: rate limiting via React Query options

Use **`useQuery`** in `CodeTagsView` to fetch `GET /api/dashboard/code-tags` with options that limit how often the API is hit:

| Option                   | Recommended value                     | Purpose                                                                                                    |
| ------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **queryKey**             | `['dashboard', 'code-tags']`          | Stable key so cache is reused.                                                                             |
| **staleTime**            | `60_000`–`120_000` (1–2 min)          | Data is considered fresh for this period; no refetch on mount/focus if still fresh.                        |
| **refetchInterval**      | `false` or `120_000` (2 min)          | No background polling, or moderate polling so the list updates without user action.                        |
| **refetchOnWindowFocus** | `false` or `true` with long staleTime | Avoid refetch every time the admin switches tabs; if `true`, staleTime ensures we don’t refetch too often. |
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

### 6.3 Manual refresh with pacer (optional)

If you add a **Refresh** button that calls `refetch()`:

- Wrap the refetch call with **`withThrottle`** or **`withRateLimit`** from `src/lib/pacer.ts` so rapid clicks do not trigger multiple requests (e.g. throttle 2–3 s, or schedule via `uiPacer`).
- Example: `const throttledRefetch = useCallback(withThrottle(() => refetch(), 2000), [refetch]);` and pass `throttledRefetch` to the button’s `onClick`.

### 6.4 Server-side rate limiting (optional)

- **GET /api/dashboard/code-tags:** Optional per-user or per-session rate limit (e.g. max N requests per minute) to protect Redis/Upstash and avoid abuse. Can reuse the same pattern as `src/app/api/auth/authenticate/route.ts` (in-memory map by IP or by session id) or a small shared helper; document in this section if added.
- **Recording (recordQrHit):** Already “rate limited” by the fact that each landing is one request; if you add an explicit cap (e.g. per IP per code per minute), do it inside `recordQrHit` or in middleware before calling it (e.g. check Redis key `qr:ratelimit:{ip}:{code}` with TTL 60s).

### 6.5 Summary (React Query + rate limiting)

| Layer                       | Mechanism                                                                                                |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Client (React Query)**    | `staleTime`, `refetchInterval`, `refetchOnWindowFocus: false` so code-tags API is not hit too often.     |
| **Client (manual refresh)** | Throttle or rate-limit the Refresh button with `withThrottle` / `withRateLimit` from `src/lib/pacer.ts`. |
| **Server (dashboard API)**  | Optional: rate limit GET /api/dashboard/code-tags per user/session.                                      |
| **Server (recording)**      | Optional: cap hits per IP+code per time window in `recordQrHit` or middleware.                           |

---

## 7. Is “ipstash” Good for This?

- If **ipstash** = **Upstash (Redis):** Yes — good for counters and optional dedupe; use it as the first storage. Optionally also POST to another system for backup.
- If **ipstash** = **external HTTP API:** Good as an additional destination: app sends events there; that system can store and aggregate. Use Upstash (or Supabase) for the dashboard’s own “list of codes and counts” unless ipstash exposes an API the dashboard can call.
- If you only have **one** place (ipstash): use it for both recording and, if it supports querying, for the dashboard; document the exact API (payload + how to read counts) so the dashboard component and API route can be implemented against it.

---

## 8. Summary

| Area              | Decision                                                                                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **When to count** | In middleware when request has `qr` on landing path (root or locale root).                                                                                                                             |
| **Storage**       | Upstash Redis for counts (and optional dedupe); optional POST to external (ipstash or other).                                                                                                          |
| **Display**       | New dashboard page `dashboard/code-tags`, new component `CodeTagsView`, new API `GET /api/dashboard/code-tags`, sidebar + home card + i18n.                                                            |
| **React Query**   | Add `QueryClientProvider` (e.g. in dashboard layout). CodeTagsView uses `useQuery` with `staleTime` / `refetchInterval` / `refetchOnWindowFocus` to rate-limit requests.                               |
| **Rate limiting** | Client: React Query options + optional pacer (`withThrottle`/`withRateLimit`) on manual Refresh. Server: optional rate limit on dashboard API and on recording.                                        |
| **External**      | Use “ipstash” (or similar) as optional event sink; keep app’s source of truth for the dashboard in Redis or Supabase so the new component can list codes and counts without depending on external API. |

This gives you a clear path from “redirect with `qr`” to “count stored” to “display in admin dashboard” with one optional external post, and controlled request rate via React Query and pacer.

# Google Business Profile Integration — Full Implementation Plan

**Project:** Darius Pizza — Single location (Cavalaire-sur-Mer)  
**Stack:** Next.js 15, App Router, Redis/File storage  
**Reference:** [Google Business Profile Hours Integration (v1)](./google-business-profile-hours-integration.md)

This document is the **actionable implementation plan**: tickboxes, checks, tests, coverage, env vars, API keys, and UI (Sonner toasts, AlertDialog context windows). For **how to set up Google Cloud and Google Business Profile**, see [Google Business Profile Setup Guide](./google-business-profile-setup-guide.md).

---

## 1. Environment Variables & API Keys

### 1.1 Required (server-only)

All of the following must be **server-only** (never exposed to the client). Add to `src/lib/env.ts` in the server schema and to deployment secrets (e.g. Vercel, Railway).

| Variable               | Description                             | Where to get it                                                                                                                                                                          |
| ---------------------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | OAuth 2.0 Web application Client ID     | [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials) → Create OAuth Client ID → Web application                                     |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Web application Client secret | Same as above; copy from the created OAuth client                                                                                                                                        |
| `GOOGLE_REFRESH_TOKEN` | Offline refresh token (long-lived)      | One-time OAuth flow with `access_type=offline` and `prompt=consent`; see [Setup Guide](./google-business-profile-setup-guide.md#obtain-refresh-token)                                    |
| `GOOGLE_LOCATION_NAME` | Location resource name                  | After OAuth, call List locations API; use `name` (e.g. `locations/12345678901234567890`) from the listing; see [Setup Guide](./google-business-profile-setup-guide.md#get-location-name) |

### 1.2 Optional (for sync status / debugging)

| Variable              | Description                                                                                           | Default         |
| --------------------- | ----------------------------------------------------------------------------------------------------- | --------------- |
| `GOOGLE_SYNC_ENABLED` | Set to `"true"` to enable sync; omit or `"false"` to skip GBP PATCH (e.g. in dev without credentials) | unset / `false` |

### 1.3 Checklist — Env & secrets

- [ ] Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_LOCATION_NAME` to server env schema in `src/lib/env.ts` (all optional so app runs without GBP).
- [ ] Document in README or `.env.example`: which vars are required for GBP sync and that they are server-only.
- [ ] Add same vars to production/staging secrets (Vercel, Railway, etc.).
- [ ] Never expose client secret or refresh token to the client or commit them to git.

---

## 2. UI: Sonner Toasts & Context Windows

### 2.1 Sonner toasts (existing `toast` from `sonner`)

Use the same pattern as `OpeningHoursEditor` / `ClosingsEditor`: `toast.success()`, `toast.error()`, `toast.warning()`.

| Trigger                                  | Toast type                                      | Message (or translation key)                                                                  |
| ---------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Hours saved and Google sync succeeded    | `toast.success()`                               | e.g. “Hours saved and synced to Google” (or reuse “Saved” if no separate copy).               |
| Hours saved but Google sync failed       | `toast.warning()` or `toast.success()` + detail | e.g. “Hours saved. Google sync failed — try again later or check setup.” (Do not block save.) |
| Closings saved and Google sync succeeded | `toast.success()`                               | e.g. “Closings saved and synced to Google”.                                                   |
| Closings saved but Google sync failed    | `toast.warning()` or `toast.success()` + detail | e.g. “Closings saved. Google sync failed.”                                                    |
| Save failed (local or network)           | `toast.error()`                                 | Existing behaviour: show API error message.                                                   |

**Implementation notes:**

- API route returns e.g. `{ success: true, config, googleSync: 'ok' | 'skipped' | 'failed' }`. Client reads `googleSync` and shows the appropriate toast.
- Optional: if `googleSync === 'failed'`, show a second line or a “Details” toast with `lastGoogleSyncError` (if exposed via a safe API or dashboard status).

### 2.2 AlertDialog context windows

| Context                               | When to show                                                                          | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Closure >5 days — manual GBP step** | User saves (or is about to save) a scheduled closing whose date range is **>5 days**. | **Title:** e.g. “Google Business Profile — manual step required”. **Description:** “This closure is longer than 5 days. Google only allows up to 5 consecutive days via our sync. You will need to set **annual closure** (or ‘Temporarily closed’) on your Google Business Profile manually for this period, and remove it when you reopen.” **Actions:** “OK” / “I understand” (and optionally combine with existing save confirmation in `ClosingsEditor`). |
| **Save confirmation (existing)**      | User clicks Save in Opening Hours or Closings.                                        | Keep existing AlertDialog for “Confirm save” as in `OpeningHoursEditor` and `ClosingsEditor`.                                                                                                                                                                                                                                                                                                                                                                  |
| **Optional: Sync failed details**     | User clicks a “Sync status” or “Why did Google sync fail?” in dashboard.              | AlertDialog or inline text with last error (e.g. from `GET /api/dashboard/google-sync-status`).                                                                                                                                                                                                                                                                                                                                                                |

### 2.3 Checklist — UI

- [ ] After PUT `/api/hours`: if response has `googleSync: 'failed'`, show Sonner warning (saved locally, Google sync failed); if `googleSync: 'ok'`, show success (saved and synced to Google).
- [ ] After PUT `/api/closings`: same logic for `googleSync`.
- [ ] In `ClosingsEditor`: when a closing has duration >5 days, show AlertDialog with “manual step required” message (before or after save); reuse existing `AlertDialog` component.
- [ ] Add translation keys for new toast messages and AlertDialog title/description (e.g. under `dashboard.hours` / `dashboard.closings`).
- [ ] Optional: dashboard badge or small “Synced to Google” / “Google sync failed” indicator using sync status API.

---

## 3. Phased Implementation (Tickboxes)

### Phase 1 — Google Cloud & access (no code)

- [ ] Complete [Google Business Profile Setup Guide](./google-business-profile-setup-guide.md): create project, enable APIs, request access if required, OAuth consent, credentials.
- [ ] Obtain refresh token and store securely.
- [ ] Get `GOOGLE_LOCATION_NAME` via List locations and store it.
- [ ] Add all four env vars to `src/lib/env.ts` (optional) and to deployment.

### Phase 2 — Core sync module (server-only)

- [ ] Add `src/lib/google-business-profile.ts` with:
  - [ ] `refreshAccessToken(): Promise<string | null>`
  - [ ] `syncRegularHours(hoursConfig: HoursConfig): Promise<{ ok: boolean; error?: string }>`
  - [ ] `syncSpecialHours(closingsConfig: ClosingsConfig, locale?: string): Promise<{ ok: boolean; error?: string }>`
- [ ] Implement mapping: `HoursConfig` → GBP `regularHours.periods` (day enum, time format).
- [ ] Implement mapping: `ClosingsConfig.scheduledClosings` → GBP `specialHours.specialHourPeriods` (max 5 consecutive days per period; closed: true; date format).
- [ ] Only call GBP when `GOOGLE_SYNC_ENABLED` is set and all four env vars are present; otherwise return `{ ok: true }` or `{ ok: false, error: 'not_configured' }` without calling Google.
- [ ] Use `updateMask=regularHours` and `updateMask=specialHours` on PATCH; never overwrite other location fields.
- [ ] Log errors; optionally persist `lastGoogleSyncAt`, `lastGoogleSyncStatus`, `lastGoogleSyncError` (e.g. in Redis or a small JSON file) for dashboard.

### Phase 3 — API routes

- [ ] In `PUT /api/hours`: after successful local save, call `syncRegularHours(savedConfig)`. Do not block response on Google; include in response e.g. `googleSync: 'ok' | 'skipped' | 'failed'` and optionally `googleSyncError` (sanitized).
- [ ] In `PUT /api/closings`: after successful local save, call `syncSpecialHours(savedConfig, locale)`. Same response shape for `googleSync`.
- [ ] Ensure 401/403/5xx from Google do not change the HTTP status of the PUT (still 200 if local save succeeded).

### Phase 4 — Dashboard UI

- [ ] Opening Hours: read `googleSync` from PUT response; show Sonner success or warning as in §2.1.
- [ ] Closings: same for PUT response.
- [ ] Closings: add check for closing duration >5 days; show AlertDialog with “manual step required” copy (§2.2).
- [ ] Add i18n keys for new messages (toasts + AlertDialog).
- [ ] Optional: add “Sync status” section or badge that calls a small status endpoint and shows last sync time/result.

### Phase 5 — Tests & coverage

- [ ] Unit tests for `google-business-profile.ts` (mappers, token refresh with mocks, PATCH with fetch mock).
- [ ] Unit tests for API routes: PUT returns 200 and correct `googleSync` when sync succeeds or is skipped/fails (mock `syncRegularHours` / `syncSpecialHours`).
- [ ] E2E: dashboard — save hours, expect success toast (and optionally “synced to Google” if test env has sync enabled).
- [ ] E2E: dashboard — add closing >5 days, save, expect AlertDialog with “manual step required” (or combined save + GBP message).
- [ ] Coverage: add `src/lib/google-business-profile.ts` (and any mapper modules) to `collectCoverageFrom` and set thresholds in `jest.config.js`.

### Phase 6 — Documentation & ops

- [ ] Document manual “Temporarily closed” / annual closure process for operators (in app or wiki).
- [ ] Add “Google sync” to final checklist in [v1 plan](./google-business-profile-hours-integration.md#14-final-checklist).

---

## 4. Verification Checks

Before considering the feature done, run through:

- [ ] **Env:** App starts without GBP vars; with vars, sync is attempted (check logs or dashboard).
- [ ] **Hours:** Change hours in dashboard → save → local storage updated; if sync enabled, GBP PATCH called (check network or logs).
- [ ] **Closings:** Add closing ≤5 days → save → local + GBP special hours updated.
- [ ] **Closings >5 days:** Add closing >5 days → save → AlertDialog appears with manual step message; local save succeeds; only first 5 days (or allowed span) sent to GBP if applicable.
- [ ] **Toasts:** Success when sync OK; warning when saved but sync failed; error when save fails.
- [ ] **No leak:** Client never receives refresh token or client secret; only `googleSync` and optional sanitized error in API response.

---

## 5. Unit Test Plan

### 5.1 `src/lib/google-business-profile.ts`

- [ ] **Token refresh:** Mock `fetch` to `oauth2.googleapis.com/token`; assert correct form body (grant_type, refresh_token, client_id, client_secret) and that a new access token is returned.
- [ ] **Token refresh failure:** Mock 400/401; assert function returns null or throws as designed.
- [ ] **Mapping — regular hours:** Given a `HoursConfig` (e.g. monday closed, tuesday 18:00–21:30), assert built payload has correct `openDay`/`closeDay` (MONDAY/TUESDAY) and `openTime`/`closeTime` format; closed days omitted or represented per API.
- [ ] **Mapping — special hours:** Given `ClosingsConfig` with one active closing (startDate, endDate), assert `specialHourPeriods` has correct `startDate`/`endDate` and `closed: true`; assert period longer than 5 days is truncated or split per spec.
- [ ] **syncRegularHours:** When env not configured, assert no fetch to GBP and return `ok: true` or `ok: false` with `not_configured`.
- [ ] **syncRegularHours:** When configured, mock successful PATCH; assert correct URL (location name), updateMask, and body.
- [ ] **syncSpecialHours:** Same: not configured vs configured; mock PATCH; assert payload and updateMask.

### 5.2 API routes

- [ ] **PUT /api/hours:** With auth, valid body: mock `saveHoursConfig` and `syncRegularHours`; assert response 200, `success: true`, `googleSync` present; assert `syncRegularHours` called with saved config.
- [ ] **PUT /api/hours:** When `syncRegularHours` returns `ok: false`, assert response still 200 and `googleSync: 'failed'`.
- [ ] **PUT /api/closings:** Same pattern: mock storage and `syncSpecialHours`; assert 200 and `googleSync` in response.

### 5.3 Mappers (if split into separate files)

- [ ] Pure functions: `hoursConfigToGBPRegularHours`, `closingsConfigToGBPSpecialHours` — test with various inputs (all closed, multiple periods, >5 day closure).

---

## 6. E2E Test Plan (Playwright)

- [ ] **Dashboard — Opening Hours save:** Log in to dashboard, go to Opening Hours, change one day, click Save, confirm dialog; expect success toast (and optionally “synced to Google” if env allows). No need for real Google in CI; can mock API or skip sync in test env.
- [ ] **Dashboard — Closings save:** Add a scheduled closing (e.g. 1 day), save; expect success toast.
- [ ] **Dashboard — Closure >5 days AlertDialog:** Add a scheduled closing with start date today and end date 7 days later; click Save; expect AlertDialog to appear with text like “manual step required” or “annual closure” before or after save; dismiss and ensure save still completes (or already completed).
- [ ] **Optional:** “Sync failed” path: mock PUT to return `googleSync: 'failed'` and assert warning toast is shown.

---

## 7. Coverage Plan

- [ ] **Include in coverage:** `src/lib/google-business-profile.ts` (and any new mapper files). Remove from `coveragePathIgnorePatterns` if a broad ignore currently excludes it.
- [ ] **Thresholds in `jest.config.js`:** Add an entry for `src/lib/google-business-profile.ts` (e.g. branches 75, functions 85, lines 80, statements 80). If mappers are in the same file, same threshold; if separate, add per-file or glob.
- [ ] **API routes:** Existing coverage for `src/app/api/hours/route.ts` and `src/app/api/closings/route.ts` should cover new branches (sync call, response shape); ensure tests mock sync and assert `googleSync` in response.

---

## 8. Summary Checklist

| Area                                                                                      | Status |
| ----------------------------------------------------------------------------------------- | ------ |
| Env vars & API keys (server-only)                                                         | [ ]    |
| Sonner toasts (success / warning / error)                                                 | [ ]    |
| AlertDialog for closure >5 days                                                           | [ ]    |
| `google-business-profile.ts` (refresh, sync, mappers)                                     | [ ]    |
| PUT /api/hours and PUT /api/closings call sync                                            | [ ]    |
| Unit tests (sync module + API routes)                                                     | [ ]    |
| E2E tests (save hours, save closings, >5 days popup)                                      | [ ]    |
| Coverage thresholds for new code                                                          | [ ]    |
| [Google Business Profile Setup Guide](./google-business-profile-setup-guide.md) completed | [ ]    |

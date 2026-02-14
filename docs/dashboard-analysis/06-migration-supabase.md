# Migration to Supabase Architecture

Guide for migrating the Darius Pizza dashboard from cookie auth + Redis/file storage to Supabase Auth + Supabase Database.

---

## Current vs Target

| Layer        | Current                      | Target                                       |
| ------------ | ---------------------------- | -------------------------------------------- |
| **Auth**     | Cookie (username + password) | Supabase Auth (email/password or magic link) |
| **Hours**    | Upstash Redis / file         | Supabase Table                               |
| **Closings** | Upstash Redis / file         | Supabase Table                               |
| **Messages** | Upstash Redis / file         | Supabase Table                               |

---

## Phase 1: Supabase Setup

1. Create Supabase project
2. Enable Auth (email/password or magic link)
3. Create tables:

```sql
-- opening_hours (single row or keyed)
CREATE TABLE opening_hours (
  id TEXT PRIMARY KEY DEFAULT 'default',
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- closings (per locale)
CREATE TABLE closings (
  locale TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- messages (per locale)
CREATE TABLE messages (
  locale TEXT PRIMARY KEY,
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: allow read for anon, write for authenticated
ALTER TABLE opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE closings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read" ON opening_hours FOR SELECT USING (true);
CREATE POLICY "Allow write for authenticated" ON opening_hours FOR ALL USING (auth.role() = 'authenticated');

-- Same for closings, messages
```

4. Add dashboard admin user(s) via Supabase Auth

---

## Phase 2: Auth Migration

### 2.1 Install Supabase SSR

```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2.2 Create Supabase Client

- `src/lib/supabase/server.ts` – server client (cookies)
- `src/lib/supabase/client.ts` – browser client
- `src/lib/supabase/middleware.ts` – middleware client for session refresh

### 2.3 Middleware

Replace cookie check with Supabase session:

```ts
// In middleware
const supabase = createServerClient(...);
const { data: { session } } = await supabase.auth.getSession();

if (isRouteProtected(pathWithoutLocale) && !session) {
  return NextResponse.rewrite(new URL(`/${locale}/auth-gate?redirect=${pathname}`, request.url));
}
```

### 2.4 Auth Gate Page

Replace `PasswordForm` with Supabase sign-in:

- Email + password form
- Or magic link
- On success: `router.push(redirectTo)` or `window.location.href`

### 2.5 RouteGuard

Replace `isAuthenticated()` with Supabase session check:

```ts
const supabase = createServerClient(...);
const { data: { session } } = await supabase.auth.getSession();
if (!session) return <PasswordForm />;
```

### 2.6 Remove

- `PAGE_ACCESS_USERNAME`, `PAGE_ACCESS_PASSWORD`
- `/api/auth/authenticate` (or keep for backward compat during migration)
- `AUTH_COOKIE_NAME` (Supabase uses its own cookies)

---

## Phase 3: Storage Migration

### 3.1 Hours Storage

Create `src/lib/hours-storage-supabase.ts`:

```ts
import { createServerClient } from '@/lib/supabase/server';

export async function getHoursConfig(): Promise<HoursConfig> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('opening_hours')
    .select('config')
    .eq('id', 'default')
    .single();
  if (data?.config) return data.config as HoursConfig;
  return staticHours;
}

export async function saveHoursConfig(config: HoursConfig) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from('opening_hours')
    .upsert({ id: 'default', config, updated_at: new Date().toISOString() });
  return error ? { ok: false, error: error.message } : { ok: true };
}
```

### 3.2 Closings / Messages

Same pattern: `from('closings').select().eq('locale', locale)` etc.

### 3.3 Switch Storage

- Option A: Feature flag – `USE_SUPABASE_STORAGE` env var, branch in storage libs
- Option B: Replace Redis/file implementations with Supabase, remove old code

---

## Phase 4: Data Migration

1. Export current data from Redis/file:
   - `data/opening-hours.json`
   - `data/closings.json`
   - `data/messages.json`

2. Seed Supabase:

```ts
// Script: scripts/seed-supabase.ts
const hours = await getHoursConfig(); // from file/Redis
await supabase.from('opening_hours').upsert({ id: 'default', config: hours });
// Same for closings, messages per locale
```

3. Verify in Supabase dashboard
4. Switch env to use Supabase
5. Remove Redis env vars

---

## Phase 5: Cleanup

- Remove `hours-storage.ts` Redis/file logic (or keep as fallback)
- Remove `closings-storage.ts`, `messages-storage.ts` Redis/file
- Remove `UPSTASH_REDIS_REST_*` from env
- Update docs

---

## Rollback Plan

- Keep Redis/file code behind feature flag during migration
- If Supabase issues: flip flag, redeploy
- Auth: can run both (cookie + Supabase) during transition

---

## Short links and analytics (`/q/XXXX` → `?qr=XXXX`)

The app supports dynamic short links for campaigns/analytics. This is independent of Supabase; it lives in middleware and a small lib.

### Behaviour

- **Path:** Any URL of the form `/q/XXXX` where `XXXX` is exactly 4 alphanumeric characters (e.g. `/q/DEMO`, `/q/BT26`).
- **Redirect:** 302 to the site root with the code exposed as a query parameter:
  - **Query param:** `qr=XXXX` (e.g. `/?qr=DEMO`).
- **Other query params:** Preserved and merged (e.g. `/q/DEMO?ref=flyer` → `/?qr=DEMO&ref=flyer`).
- **No config:** No JSON or config lookup; any valid 4-char code is accepted.

### Implementation

| Piece      | Location                               | Role                                                                                                                               |
| ---------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Resolver   | `src/lib/qRedirect.ts`                 | `resolveQRedirect(request)` — matches `/q/([A-Za-z0-9]{4})`, builds redirect URL with `qr=code`, preserves existing search params. |
| Middleware | `src/middleware.ts`                    | Calls `resolveQRedirect(request)` first; if non-null, returns that redirect before locale/static/legacy logic.                     |
| Unit tests | `src/lib/__tests__/qRedirect.test.ts`  | Non-match, any code, param preservation, overwrite of existing `qr`.                                                               |
| E2E        | `tests/e2e/campaign-redirects.spec.ts` | `/q/DEMO` and `/q/BT26` redirect and final URL has `qr`; existing params preserved.                                                |

### Flow

1. User hits `https://site.com/q/DEMO` or `https://site.com/q/DEMO?ref=flyer`.
2. Middleware runs; `resolveQRedirect` matches and returns `NextResponse.redirect(targetUrl, 302)`.
3. Target URL is `https://site.com/?qr=DEMO` (or `/?qr=DEMO&ref=flyer`).
4. Subsequent middleware (e.g. next-intl) may redirect to a locale path (e.g. `/fr?qr=DEMO`); `qr` remains in the URL for analytics/tracking.

### Removal / legacy

- The previous campaign redirect (config-driven, `campaigns.json`) was removed in favour of this dynamic behaviour.
- `src/config/site/campaigns.json` and `src/config/generic/campaigns-config.ts` remain in the repo but are no longer used for redirects.

---

## Checklist Summary

- [ ] Supabase project + tables + RLS
- [ ] Supabase Auth enabled, admin user created
- [ ] @supabase/ssr installed, server/client/middleware clients
- [ ] Middleware: Supabase session instead of cookie
- [ ] Auth gate: Supabase sign-in
- [ ] RouteGuard: Supabase session
- [ ] hours-storage-supabase, closings-storage-supabase, messages-storage-supabase
- [ ] API routes: use Supabase storage
- [ ] Data migration script
- [ ] Remove old auth + Redis/file code

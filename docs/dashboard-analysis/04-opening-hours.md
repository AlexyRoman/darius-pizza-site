# Opening Hours System

Editable opening hours with Redis/file storage. See also [../opening-hours-api-report.md](../opening-hours-api-report.md) for full API details.

---

## Overview

| Aspect       | Implementation                                                  |
| ------------ | --------------------------------------------------------------- |
| **Storage**  | Upstash Redis (serverless) or `data/opening-hours.json` (local) |
| **Fallback** | `src/content/restaurant/hours.json` (static, read-only)         |
| **API**      | GET `/api/hours`, PUT `/api/hours`                              |
| **Client**   | `useHours()` hook, `OpeningHoursEditor` component               |

---

## Storage Layer (`src/lib/hours-storage.ts`)

### Read Order

1. Upstash Redis (if `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` set)
2. `data/opening-hours.json`
3. Static `src/content/restaurant/hours.json`

### Write Order

1. Upstash Redis (if configured)
2. `data/opening-hours.json`
3. Return error if both fail

### Redis Key

`opening_hours` (single key, full config)

### Environment Variables

```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## API Routes (`src/app/api/hours/route.ts`)

### GET `/api/hours`

- Returns `HoursConfig` from storage
- `dynamic = 'force-dynamic'`
- `Cache-Control: no-store, no-cache` (no caching)

### PUT `/api/hours`

- Requires authentication (`isAuthenticated()`)
- Validates body structure (openingHours, all days, isOpen, periods)
- Calls `saveHoursConfig()`
- `revalidatePath('/api/hours')`, `revalidatePath('/', 'layout')`
- Returns `{ success: true, config: saved }` (saved config from `getHoursConfig()`)

---

## Client (`src/hooks/useHours.ts`)

- Fetches from `/api/hours?_=${Date.now()}` with `cache: 'no-store'`
- Uses static hours as initial state (avoids flash)
- `refetch()` for manual refresh after save

---

## Editor (`src/components/auth/OpeningHoursEditor.tsx`)

- Uses `useHours()` for data
- `useEffect` syncs `form` from `data`
- PUT on save; uses `json.config` from response to update form immediately
- Calls `refetch()` after save
- Toast on success/error

---

## Redis Persistence Fixes (from previous work)

1. **GET cache:** Removed `s-maxage=3600`; use `no-store, no-cache`
2. **PUT response:** Return `config` from `getHoursConfig()` after save
3. **Editor:** Use `json.config` from PUT response to update form (avoid stale refetch)
4. **Refetch:** Add `?_=${Date.now()}` and `Pragma: no-cache` headers
5. **Logging:** Dev logs for Redis read/write (which backend, monday.isOpen)

---

## Re-implementation Checklist

1. Create `hours-storage.ts` with Redis + file backends
2. Create GET/PUT API routes with auth on PUT
3. Create `useHours` hook with cache-busting
4. Create `OpeningHoursEditor` with form state, PUT, refetch
5. Add `data/` to `.gitignore` if not committing runtime data

---

## Supabase Migration Notes

Replace Redis/file with Supabase:

- Table: `opening_hours` (id, config JSONB, updated_at)
- Or single row with key `default`
- RLS: allow read for anon, write for authenticated
- `getHoursConfig()` → Supabase select
- `saveHoursConfig()` → Supabase upsert

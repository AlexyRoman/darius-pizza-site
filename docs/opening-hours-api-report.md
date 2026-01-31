# Opening Hours API & Data Flow Report

This document explains how the opening hours system works: where data is stored, how it flows between static and dynamic sources, and how the API behaves.

---

## Executive Summary

| Aspect                         | Answer                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Does the API change JSON?**  | Yes. It writes to `data/opening-hours.json` (file backend) or Upstash Redis (serverless).              |
| **Where is data stored?**      | File: `data/opening-hours.json` or Redis (when configured).                                            |
| **Static or dynamic?**         | **Dynamic.** Hours are fetched at runtime via the API. Static `hours.json` is only a fallback/default. |
| **Used at static generation?** | No. Pages that display hours are client components that fetch from `/api/hours` at runtime.            |

---

## 1. Data Sources

There are **two** JSON-related sources for opening hours:

### 1.1 Static (read-only)

| Path                                | Purpose                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `src/content/restaurant/hours.json` | Default/fallback hours. Bundled at build time. **Never modified by the API.** |

- Imported directly in code (`@/content/restaurant/hours.json`).
- Used as initial state in `useHours` to avoid a flash before the API responds.
- Used as fallback in `hours-storage` when Redis and file storage are empty or unavailable.

### 1.2 Dynamic (writable)

| Path                      | Purpose                                                                    |
| ------------------------- | -------------------------------------------------------------------------- |
| `data/opening-hours.json` | Runtime storage when using the **file backend** (local dev, VPS, Railway). |

- Created/updated by the API when saving hours.
- Lives in the project root `data/` directory.
- **Not** in `.gitignore` by default (can be committed or ignored depending on deployment).

---

## 2. Storage Layer (`src/lib/hours-storage.ts`)

The storage layer supports two backends and a fallback:

```
┌─────────────────────────────────────────────────────────────────┐
│                     getHoursConfig()                             │
│  1. Try Upstash Redis (if UPSTASH_REDIS_REST_* env vars set)    │
│  2. Try data/opening-hours.json                                  │
│  3. Fallback → src/content/restaurant/hours.json (static)       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     saveHoursConfig()                           │
│  1. Try Upstash Redis (if configured)                           │
│  2. Try data/opening-hours.json (file write)                     │
│  3. Return error if both fail                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 Backend selection

| Environment                    | Backend                          | Notes                                    |
| ------------------------------ | -------------------------------- | ---------------------------------------- |
| **Vercel / serverless**        | Upstash Redis                    | Filesystem is read-only; Redis required. |
| **Local dev, VPS, Railway**    | File (`data/opening-hours.json`) | Writes to disk.                          |
| **No Redis, no writable file** | Read-only fallback               | Uses static `hours.json`; saves fail.    |

### 2.2 Does the API change the JSON?

**Yes**, when using the file backend:

- `saveHoursConfig()` writes to `data/opening-hours.json`.
- The file is created if missing (`mkdir` with `recursive: true`).
- Content is pretty-printed (`JSON.stringify(config, null, 2)`).
- `lastUpdated` is set to the current ISO timestamp.

**No** change to `src/content/restaurant/hours.json` — that file is never written by the API.

---

## 3. API Route (`/api/hours`)

| Method  | Auth     | Behavior                                                     |
| ------- | -------- | ------------------------------------------------------------ |
| **GET** | None     | Returns hours from storage (Redis → file → static fallback). |
| **PUT** | Required | Validates body, saves via storage layer, revalidates layout. |

### 3.1 Dynamic behavior

```ts
export const dynamic = 'force-dynamic';
```

The route is always dynamic; it is never statically generated.

### 3.2 PUT flow

1. Check authentication (`isAuthenticated()`).
2. Validate request body (`validateHoursConfig`).
3. Call `saveHoursConfig()` (Redis or file).
4. On success: `revalidatePath('/', 'layout')` to invalidate cached pages.
5. Return `{ success: true }` or an error.

### 3.3 Validation

- All 7 days must be present.
- Each day: `isOpen` (boolean), `periods` (array).
- Each period: `open` and `close` (strings, e.g. `"18:00"`).

---

## 4. Client-Side Consumption

### 4.1 `useHours` hook (`src/hooks/useHours.ts`)

- Fetches from `/api/hours` with `cache: 'no-store'`.
- Uses static `hours.json` as initial state to avoid a flash.
- On mount: fetches from API and replaces state.
- Exposes `data`, `loading`, `error`, `refetch`.

### 4.2 Components using hours

| Component             | Usage                                             |
| --------------------- | ------------------------------------------------- |
| `HeroSection`         | Open/closed badge, “next opening” text.           |
| `OpeningHoursSection` | Full schedule, today’s hours, next opening.       |
| `SmartCallButton`     | Whether to show call button based on open status. |
| `OpeningHoursEditor`  | Dashboard form to edit and save hours.            |

All of these are client components that call `useHours()` and thus fetch from the API at runtime.

---

## 5. Static vs Dynamic Rendering

### 5.1 Hours are not used at static generation

- Pages that show hours use `useHours()` (client-side fetch).
- No `generateStaticParams` or similar uses hours.
- Hours are loaded after hydration via `/api/hours`.

### 5.2 Cache invalidation

After a successful PUT:

```ts
revalidatePath('/', 'layout');
```

This invalidates the layout cache so that subsequent requests get fresh data. Because hours are fetched client-side from the API, the main effect is that the API itself always reads from the current storage (Redis or file).

---

## 6. Data Flow Diagram

```
                    ┌──────────────────────────────────────┐
                    │  src/content/restaurant/hours.json    │
                    │  (static, bundled at build)           │
                    └─────────────────┬────────────────────┘
                                      │
                                      │ fallback / initial state
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         hours-storage.ts                                │
│  getHoursConfig: Redis → File → static                                  │
│  saveHoursConfig: Redis OR File (never static)                          │
└─────────────────────────────────────────────────────────────────────────┘
                    ▲                                    │
                    │ read                               │ write
                    │                                    ▼
┌───────────────────┴────────────┐         ┌────────────────────────────┐
│  GET /api/hours                 │         │  PUT /api/hours            │
│  (no auth)                      │         │  (auth required)          │
└─────────────────────────────────┘         └────────────────────────────┘
                    │                                    │
                    │                                    │ revalidatePath
                    ▼                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  useHours() → fetch('/api/hours')                                        │
│  HeroSection, OpeningHoursSection, SmartCallButton, OpeningHoursEditor │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. File Locations Summary

| File                                | Writable? | When used                       |
| ----------------------------------- | --------- | ------------------------------- |
| `src/content/restaurant/hours.json` | No        | Default/fallback, initial state |
| `data/opening-hours.json`           | Yes       | Runtime storage (file backend)  |
| Upstash Redis key `opening_hours`   | Yes       | Runtime storage (serverless)    |

---

## 8. Deployment Notes

### Vercel / serverless

- Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
- File backend will not work (read-only filesystem).
- Redis is the only writable backend.

### Self-hosted (VPS, Railway, etc.)

- Ensure `data/` is writable.
- `data/opening-hours.json` will be created/updated on save.
- Redis is optional; file backend is sufficient.

### Git

- `data/opening-hours.json` is not in `.gitignore` by default.
- You can add it to `.gitignore` if you want to keep runtime edits out of version control.

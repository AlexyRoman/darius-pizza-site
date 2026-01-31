# Authentication System

Cookie-based password gate for dashboard access. Uses username + password from env vars.

---

## Environment Variables

```env
PAGE_ACCESS_USERNAME=admin
PAGE_ACCESS_PASSWORD=your-secure-password
```

**Location:** `.env.local` (not tracked in git)

---

## Components

### 1. `src/lib/auth-constants.ts`

```ts
export const AUTH_COOKIE_NAME = 'authToken';
```

Edge-safe constant used by middleware and API.

### 2. `src/lib/auth.ts`

- `isAuthenticated()` – Server-side: reads `authToken` cookie, returns `true` if value is `'authenticated'`
- `isRouteProtected(path)` – Checks if path matches `protected-routes.json`
- `getProtectedRoutes()` – Returns list of protected paths

### 3. `src/config/site/protected-routes.json`

```json
{
  "routes": ["/dashboard"],
  "credentials": {
    "note": "Username and password via PAGE_ACCESS_USERNAME and PAGE_ACCESS_PASSWORD"
  }
}
```

Paths are **without** locale prefix. `/dashboard` matches `/fr/dashboard`, `/en/dashboard`, etc.

### 4. Middleware (`src/middleware.ts`)

**Flow:**

1. Extract `pathWithoutLocale` (strip locale prefix)
2. If `isRouteProtected(pathWithoutLocale)` and no `authToken` cookie:
   - Rewrite to `/[locale]/auth-gate?redirect=[original path]`
3. Otherwise continue to next-intl

**Dashboard locale redirect:** Non-fr/en locales hitting `/dashboard` redirect to `/en/dashboard`.

### 5. `src/app/[locale]/(site)/auth-gate/page.tsx`

- Reads `redirect` from search params
- If authenticated → `redirect(redirectTo)`
- Otherwise renders `PasswordForm` with `redirectTo`

### 6. `src/components/auth/PasswordForm.tsx`

- Client component: username + password inputs
- POST to `/api/auth/authenticate`
- On success: sets cookie via response, then `window.location.href = redirectTo` or `window.location.reload()`
- Uses `toast.success` / `toast.error`

### 7. `src/components/auth/RouteGuard.tsx`

- Server component
- If path not protected → render children
- If protected and not authenticated → render `PasswordForm`
- If authenticated → render children

### 8. API: `POST /api/auth/authenticate`

**Request:**

```json
{ "username": "admin", "password": "secret" }
```

**Logic:**

- Rate limit: 10 attempts per 15 min per IP
- `timingSafeEqual` for username and password
- On success: set `authToken=authenticated` cookie (httpOnly, secure in prod, sameSite: strict, maxAge: 1h)
- Returns `{ success: true }` or `{ error: "..." }`

---

## Re-implementation Checklist

1. Add `AUTH_COOKIE_NAME` constant
2. Add `protected-routes.json` with route list
3. Implement `isAuthenticated()`, `isRouteProtected()` in `lib/auth.ts`
4. Add middleware check before intl: rewrite to auth-gate if protected + no cookie
5. Create auth-gate page with PasswordForm
6. Create RouteGuard server component
7. Create POST `/api/auth/authenticate` with rate limit + timingSafeEqual
8. Wrap dashboard layout with RouteGuard

---

## Supabase Migration Notes

Replace cookie auth with Supabase Auth:

- Use `createServerClient` in middleware to validate session
- Replace `isAuthenticated()` with Supabase session check
- Replace PasswordForm with Supabase sign-in (email/password or magic link)
- Store session in cookies via `@supabase/ssr`

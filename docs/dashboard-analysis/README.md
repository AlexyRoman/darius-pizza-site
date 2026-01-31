# Dashboard Analysis & Migration Docs

Documentation for the Darius Pizza dashboard implementation, built from previous commits and iterative development. Use these docs to re-implement or migrate to Supabase.

---

## Documents

| Doc                                                    | Description                                        |
| ------------------------------------------------------ | -------------------------------------------------- |
| [01-overview.md](./01-overview.md)                     | Architecture overview, file structure, key commits |
| [02-authentication.md](./02-authentication.md)         | Auth flow, credentials, middleware, RouteGuard     |
| [03-sidebar-layout.md](./03-sidebar-layout.md)         | shadcn sidebar-07, brand theming, trigger/rail     |
| [04-opening-hours.md](./04-opening-hours.md)           | Hours storage, API, editor, Redis fixes            |
| [05-closings-messages.md](./05-closings-messages.md)   | Closings and messages (same pattern as hours)      |
| [06-migration-supabase.md](./06-migration-supabase.md) | Supabase migration guide                           |

---

## Related

- [../opening-hours-api-report.md](../opening-hours-api-report.md) – Full opening hours API & data flow report

---

## Quick Reference

**Auth:** Cookie `authToken=authenticated`, env `PAGE_ACCESS_USERNAME` + `PAGE_ACCESS_PASSWORD`

**Storage:** Upstash Redis (serverless) or `data/*.json` (local)

**Dashboard route:** `/[locale]/dashboard` (fr, en only)

**Protected routes:** `/dashboard` and subpaths (from `protected-routes.json`)

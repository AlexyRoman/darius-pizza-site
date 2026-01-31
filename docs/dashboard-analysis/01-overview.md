# Dashboard Architecture Overview

This document provides a high-level overview of the Darius Pizza dashboard implementation, built from previous commits and iterative development.

---

## Executive Summary

| Aspect        | Implementation                                        |
| ------------- | ----------------------------------------------------- |
| **Framework** | Next.js 15 App Router + next-intl                     |
| **UI**        | shadcn/ui (sidebar-07 block)                          |
| **Auth**      | Cookie-based password gate (username + password)      |
| **Storage**   | Upstash Redis (serverless) or file system (local/VPS) |
| **Locales**   | Dashboard: `fr`, `en` only                            |
| **Route**     | `/[locale]/dashboard` (e.g. `/fr/dashboard`)          |

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── authenticate/route.ts   # POST login
│   │   │   └── check/route.ts          # GET auth status
│   │   ├── hours/route.ts              # GET/PUT opening hours
│   │   ├── closings/route.ts           # GET/PUT closings
│   │   └── messages/route.ts           # GET/PUT messages
│   └── [locale]/
│       ├── (dashboard)/
│       │   ├── layout.tsx              # Dashboard route group layout
│       │   └── dashboard/
│       │       ├── layout.tsx          # RouteGuard + SidebarProvider
│       │       ├── page.tsx           # Dashboard home
│       │       ├── opening-hours/page.tsx
│       │       ├── closings/page.tsx
│       │       └── messages/page.tsx
│       └── (site)/
│           └── auth-gate/page.tsx     # Login page
├── components/
│   ├── auth/
│   │   ├── RouteGuard.tsx
│   │   ├── PasswordForm.tsx
│   │   ├── OpeningHoursEditor.tsx
│   │   ├── ClosingsEditor.tsx
│   │   └── MessagesEditor.tsx
│   ├── app-sidebar.tsx
│   └── dashboard/
│       ├── DashboardBreadcrumb.tsx
│       └── DashboardLocaleToggle.tsx
├── lib/
│   ├── auth.ts
│   ├── auth-constants.ts
│   ├── hours-storage.ts
│   ├── closings-storage.ts
│   └── messages-storage.ts
└── config/site/
    └── protected-routes.json
```

---

## Key Commits (Chronological)

| Commit    | Description                               |
| --------- | ----------------------------------------- |
| `b1908bf` | feat: begin dashboard creation            |
| `e478b53` | feat: username and sidebar ui phone       |
| `09fc65b` | feat: dashboard access button             |
| `2b9135d` | fix: redis arch                           |
| `3d7b2cf` | feat: sidebar ui                          |
| `2149e32` | feat: handle messages and closing updates |

---

## Data Flow

```
User → /fr/dashboard
  → Middleware: isRouteProtected? → No auth? → Rewrite to /fr/auth-gate
  → RouteGuard: isAuthenticated? → No? → PasswordForm
  → SidebarProvider + AppSidebar + SidebarInset
  → Dashboard pages (opening-hours, closings, messages)
```

---

## Related Documentation

- [02-authentication.md](./02-authentication.md) – Auth flow, credentials, middleware
- [03-sidebar-layout.md](./03-sidebar-layout.md) – shadcn sidebar-07, theming, trigger/rail
- [04-opening-hours.md](./04-opening-hours.md) – Hours storage, API, editor
- [05-closings-messages.md](./05-closings-messages.md) – Closings and messages
- [06-migration-supabase.md](./06-migration-supabase.md) – Supabase migration guide

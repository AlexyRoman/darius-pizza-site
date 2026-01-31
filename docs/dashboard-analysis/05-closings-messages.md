# Closings & Messages

Editable closings (holiday closures) and messages (banner/announcements) with the same Redis/file pattern as opening hours.

---

## Overview

| Feature      | Storage                                           | API                     | Editor           |
| ------------ | ------------------------------------------------- | ----------------------- | ---------------- |
| **Closings** | Redis `closings_{locale}` or `data/closings.json` | GET/PUT `/api/closings` | `ClosingsEditor` |
| **Messages** | Redis `messages_{locale}` or `data/messages.json` | GET/PUT `/api/messages` | `MessagesEditor` |

Both are **per-locale** (fr, en, etc.).

---

## Storage Pattern

Same as hours-storage:

1. **Read:** Upstash Redis → file → fallback (loadRestaurantConfig)
2. **Write:** Upstash Redis → file → error

### Redis Keys

- Closings: `closings_fr`, `closings_en`, etc.
- Messages: `messages_fr`, `messages_en`, etc.

### File Paths

- `data/closings.json` – `{ "fr": {...}, "en": {...} }`
- `data/messages.json` – `{ "fr": {...}, "en": {...} }`

---

## API Routes

### Closings

- `GET /api/closings?locale=fr` – returns `ClosingsConfig` for locale
- `PUT /api/closings` – body: `{ locale, closings }`, requires auth

### Messages

- `GET /api/messages?locale=fr` – returns `MessagesConfig` for locale
- `PUT /api/messages` – body: `{ locale, messages }`, requires auth

---

## Components

- `src/components/auth/ClosingsEditor.tsx`
- `src/components/auth/MessagesEditor.tsx`

Both follow the same pattern as `OpeningHoursEditor`: use hook for data, form state, PUT on save, refetch.

---

## Re-implementation Checklist

1. Create `closings-storage.ts` and `messages-storage.ts` (same pattern as hours)
2. Create GET/PUT API routes with locale param
3. Create editors with locale-aware fetch
4. Add sidebar links to closings and messages pages

---

## Supabase Migration Notes

- Table: `closings` (locale, config JSONB, updated_at)
- Table: `messages` (locale, config JSONB, updated_at)
- Or single table `dashboard_config` (key, locale, config, updated_at)
- RLS: read anon, write authenticated

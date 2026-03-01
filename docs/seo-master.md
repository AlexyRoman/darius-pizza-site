# SEO Master — Plan & Actions

This document records how site SEO is managed and what was done to align Google snippets with intended meta descriptions.

---

## 1. How metadata is managed

| Layer             | Where                                                          | Purpose                                                                    |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Root layout**   | `src/app/layout.tsx`                                           | Fallback title/description, icons, manifest, default OG/Twitter (English). |
| **Locale layout** | `src/app/[locale]/layout.tsx`                                  | Delegates to `generateLocalizedMetadata()` per route.                      |
| **Per-page**      | Page files + `generatePageMetadata()` in `src/lib/metadata.ts` | Page-specific title/description from locale `seo.*`.                       |
| **Locale copy**   | `src/locales/{fr,en,de,...}.json` → `seo`                      | `title`, `description`, `keywords`, `home.*`, `menu.*`, `info.*`, etc.     |

**Flow:** `generateLocalizedMetadata({ locale, path, customTitle?, customDescription? })` reads `messages.seo` from the locale JSON and returns Next.js `Metadata` (title, description, openGraph, twitter, alternates/hreflang, verification, etc.).

**Canonical & hreflang:** Built in metadata: `alternates.canonical` and `alternates.languages` (x-default + all enabled locales). No trailing slashes; locale always in path.

---

## 2. Sitemap & robots

- **Sitemap:** `src/app/sitemap.ts` — all enabled locales × `PAGES` (home, menu, info, privacy, cookies, legal-mentions). Priorities and changeFrequency from `src/config/site/pages.ts`.
- **Robots:** `src/app/robots.ts` — uses `src/config/generic/robots` (rules, sitemap URL, host). Disallowed paths from `src/config/site/robots/settings/disallowed-paths.json`.

---

## 3. Structured data (JSON-LD)

- **Menu:** `src/app/[locale]/(site)/menu/page.tsx` — `schema.org/Menu` with `hasMenuSection` / `MenuItem`, prices, currency.
- **LocalBusiness:** Not yet added. Optional future: add `LocalBusiness` (or `Restaurant`) on home or layout with name, address, telephone, openingHours to reinforce local SEO.

---

## 4. Google snippet vs meta description (issue & fix)

**Observed:** Google sometimes showed a snippet built from **special messages** (takeaway-only + “Prises de commande par téléphone ou sur place”) instead of the locale `seo.description`.

**Cause:** Those messages are rendered as prominent alerts in `OpeningHoursSection`. Google often prefers on-page content for snippets, especially for local queries.

**Actions taken:**

1. **`data-nosnippet` on special messages block**  
   In `src/components/sections/OpeningHoursSection.tsx`, the wrapper div around the “Important updates” / special messages alerts is marked with `data-nosnippet`. This asks search engines not to use that block for the search snippet, so they are more likely to use the meta description.

2. **No change to visible content**  
   Messages stay as-is for users; only snippet selection is influenced.

**Optional (manual):**

- In [Google Business Profile](https://business.google.com), set the business / “From the owner” description to the same line you want in search (e.g. copy from `seo.description` in `fr.json`).
- If you want the snippet to stay “message-style”, remove `data-nosnippet` from the special messages block.

---

## 5. SEO checklist (current state)

- [x] Meta title and description per locale from `locales/*.json` → `seo`.
- [x] Open Graph and Twitter Card (title, description, image) via `generateLocalizedMetadata`.
- [x] Canonical URL and hreflang (x-default + all locales) in metadata.
- [x] Sitemap with locale-prefixed URLs; robots.txt with sitemap and host.
- [x] Menu JSON-LD (schema.org Menu) on menu page.
- [x] Snippet control: `data-nosnippet` on special messages so meta description can be preferred.
- [ ] Optional: LocalBusiness/Restaurant JSON-LD on home or layout.
- [ ] Optional: Verify `seo.description` in GBP “From the owner” if you want consistency in Knowledge Panel.

---

## 6. Files touched for this pass

| File                                              | Change                                                        |
| ------------------------------------------------- | ------------------------------------------------------------- |
| `docs/seo-master.md`                              | Added (this doc).                                             |
| `src/components/sections/OpeningHoursSection.tsx` | Added `data-nosnippet` to the special messages container div. |

---

## 7. Commands to verify

```bash
npm run master    # fix, lint, type-check, build, test:coverage
npx playwright test    # e2e (starts dev server; use when port 3000 is free)
```

**Last run:** `npm run master` ✅ | `npx playwright test` ✅ (25 passed, 3 skipped).

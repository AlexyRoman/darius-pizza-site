# IndexNow integration (Bing, Yandex, Edge)

This project submits all public pages and the sitemap to **IndexNow** so they get indexed faster in Bing, Yandex, and browsers using Bing (Edge, DuckDuckGo partly). Google does not use IndexNow.

## Setup

1. **Key file**  
   A key file is already in place: `public/dariuspizza2026.txt` with content `dariuspizza2026`.  
   After deploy it must be reachable at:

   ```
   https://dariuspizza.fr/dariuspizza2026.txt
   ```

   If you change the key, create `public/{your-key}.txt` with content `{your-key}` and set `INDEXNOW_KEY` to that value.

2. **Environment**  
   In `.env.local` (or your host’s env) set:
   - `INDEXNOW_KEY=dariuspizza2026` (or your key; must match the filename above).
   - `NEXT_PUBLIC_SITE_URL=https://dariuspizza.fr` (or your production URL).

   Optional: set `INDEXNOW_SUBMIT_SECRET` and pass it when calling the API so only you can trigger submission.

## Submitting URLs

### Option A: After each deploy (recommended)

Call the API route (site must be deployed first):

```bash
# Without secret
curl -X POST https://dariuspizza.fr/api/indexnow

# With secret (if INDEXNOW_SUBMIT_SECRET is set)
curl -X POST "https://dariuspizza.fr/api/indexnow?secret=YOUR_SECRET"
```

Or use the npm script (loads `.env.local` and calls the API):

```bash
npm run indexnow:submit
```

Set `NEXT_PUBLIC_SITE_URL` (and optionally `INDEXNOW_SUBMIT_SECRET`) in `.env.local` or in the environment. You can also pass the secret as an argument: `node scripts/submit-indexnow.js YOUR_SECRET`.

### Option B: One-off curl (all locales)

You can also submit a fixed list with curl:

```bash
curl -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json" \
  -d '{
    "host": "dariuspizza.fr",
    "key": "dariuspizza2026",
    "keyLocation": "https://dariuspizza.fr/dariuspizza2026.txt",
    "urlList": [
      "https://dariuspizza.fr/sitemap.xml",
      "https://dariuspizza.fr/fr",
      "https://dariuspizza.fr/en",
      "https://dariuspizza.fr/de",
      "https://dariuspizza.fr/es",
      "https://dariuspizza.fr/it",
      "https://dariuspizza.fr/nl",
      "https://dariuspizza.fr/fr/menu",
      "https://dariuspizza.fr/en/menu",
      "..."
    ]
  }'
```

The API route builds the same list automatically from your sitemap config (all locales × all pages) and adds `sitemap.xml`.

## What gets submitted

- Every locale (fr, en, de, es, it, nl) and every public page (home, menu, info, privacy, cookies, legal-mentions).
- The sitemap URL: `https://dariuspizza.fr/sitemap.xml`.

So Bing can discover and crawl all of them quickly.

## Expected results

- **Bing**: typically 1–3 days.
- **Edge search**: updated within a few days.
- **DuckDuckGo**: can improve over 1–2 weeks.

## Verify key file

After deploy, open:

```
https://dariuspizza.fr/dariuspizza2026.txt
```

The response body must be exactly:

```
dariuspizza2026
```

(no extra characters or newlines).

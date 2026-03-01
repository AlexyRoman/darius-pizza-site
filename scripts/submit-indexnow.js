#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- Node script, no ESM */
/**
 * Submits all sitemap URLs to IndexNow via the site's API route.
 * Run after deploy with production env (e.g. NEXT_PUBLIC_SITE_URL).
 *
 * Usage:
 *   NEXT_PUBLIC_SITE_URL=https://dariuspizza.fr node scripts/submit-indexnow.js
 *   # Or with optional secret:
 *   NEXT_PUBLIC_SITE_URL=https://dariuspizza.fr INDEXNOW_SUBMIT_SECRET=xxx node scripts/submit-indexnow.js [secret]
 *
 * Loads .env.local if present.
 */

function loadEnvLocal() {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eq = trimmed.indexOf('=');
          if (eq > 0) {
            const key = trimmed.slice(0, eq).trim();
            const value = trimmed
              .slice(eq + 1)
              .trim()
              .replace(/^["']|["']$/g, '');
            if (!process.env[key]) process.env[key] = value;
          }
        }
      });
    }
  } catch {
    // ignore missing or unreadable .env.local
  }
}

loadEnvLocal();

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!baseUrl) {
  console.error('Missing NEXT_PUBLIC_SITE_URL. Set it or add to .env.local');
  process.exit(1);
}

const url = baseUrl.replace(/\/$/, '') + '/api/indexnow';
const secret = process.env.INDEXNOW_SUBMIT_SECRET || process.argv[2];
const finalUrl = secret ? `${url}?secret=${encodeURIComponent(secret)}` : url;

fetch(finalUrl, { method: 'POST' })
  .then(res => res.json().then(body => ({ status: res.status, body })))
  .then(({ status, body }) => {
    if (status >= 400) {
      console.error('IndexNow submit failed:', status, body);
      process.exit(1);
    }
    console.log('IndexNow submit ok:', body);
  })
  .catch(err => {
    console.error('Request failed:', err.message);
    process.exit(1);
  });

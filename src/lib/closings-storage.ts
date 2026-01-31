/**
 * Closings storage abstraction.
 *
 * Supports two backends:
 * - Upstash Redis: when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 * - File: data/closings.json. Use for local dev and self-hosted.
 *
 * Stores per-locale merged config. Falls back to loadRestaurantConfig when empty.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import { loadRestaurantConfig } from '@/lib/restaurant-config';
import type { ClosingsConfig } from '@/types/restaurant-config';

const REDIS_KEY_PREFIX = 'closings_';
const FILE_PATH = join(process.cwd(), 'data', 'closings.json');

type LocaleKeyedConfig = Record<string, ClosingsConfig>;

function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function getFromUpstash(locale: string): Promise<ClosingsConfig | null> {
  if (!isUpstashConfigured()) return null;
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const data = await redis.get<ClosingsConfig>(
      `${REDIS_KEY_PREFIX}${locale}`
    );
    return data ?? null;
  } catch {
    return null;
  }
}

async function saveToUpstash(
  locale: string,
  config: ClosingsConfig
): Promise<boolean> {
  if (!isUpstashConfigured()) return false;
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    await redis.set(`${REDIS_KEY_PREFIX}${locale}`, config);
    return true;
  } catch {
    return false;
  }
}

async function getFromFile(locale: string): Promise<ClosingsConfig | null> {
  try {
    const raw = await readFile(FILE_PATH, 'utf-8');
    const data = JSON.parse(raw) as LocaleKeyedConfig;
    return data[locale] ?? null;
  } catch {
    return null;
  }
}

async function saveToFile(
  locale: string,
  config: ClosingsConfig
): Promise<boolean> {
  try {
    const dir = join(process.cwd(), 'data');
    await mkdir(dir, { recursive: true });
    let existing: LocaleKeyedConfig = {};
    try {
      const raw = await readFile(FILE_PATH, 'utf-8');
      existing = JSON.parse(raw) as LocaleKeyedConfig;
    } catch {
      /* file doesn't exist yet */
    }
    existing[locale] = config;
    await writeFile(FILE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

export async function getClosingsConfig(
  locale: string
): Promise<ClosingsConfig> {
  const fromUpstash = await getFromUpstash(locale);
  if (fromUpstash) return fromUpstash;

  const fromFile = await getFromFile(locale);
  if (fromFile) return fromFile;

  return loadRestaurantConfig('closings', locale);
}

export async function saveClosingsConfig(
  locale: string,
  config: ClosingsConfig
): Promise<{ ok: true } | { ok: false; error: string }> {
  const updated = {
    ...config,
    lastUpdated: new Date().toISOString(),
  };

  if (isUpstashConfigured()) {
    const saved = await saveToUpstash(locale, updated);
    if (saved) return { ok: true };
  }

  const fileSaved = await saveToFile(locale, updated);
  if (fileSaved) return { ok: true };

  return {
    ok: false,
    error:
      'Could not save. For Vercel/serverless, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. For self-hosted, ensure the data/ directory is writable.',
  };
}

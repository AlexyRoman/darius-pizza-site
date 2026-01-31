/**
 * Opening hours storage abstraction.
 *
 * Supports two backends:
 * - Upstash Redis: when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 *   Use for Vercel/serverless (filesystem is read-only).
 * - File: data/opening-hours.json. Use for local dev and self-hosted (VPS, Railway).
 *
 * Reads fall back to static hours.json if storage is empty.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { HoursConfig } from '@/types/restaurant-config';

import staticHoursJson from '@/content/restaurant/hours.json';

const REDIS_KEY = 'opening_hours';
const FILE_PATH = join(process.cwd(), 'data', 'opening-hours.json');
const staticHours = staticHoursJson as HoursConfig;

function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function getFromUpstash(): Promise<HoursConfig | null> {
  if (!isUpstashConfigured()) return null;
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const data = await redis.get<HoursConfig>(REDIS_KEY);
    return data ?? null;
  } catch {
    return null;
  }
}

async function saveToUpstash(config: HoursConfig): Promise<boolean> {
  if (!isUpstashConfigured()) return false;
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    await redis.set(REDIS_KEY, config);
    return true;
  } catch {
    return false;
  }
}

async function getFromFile(): Promise<HoursConfig | null> {
  try {
    const raw = await readFile(FILE_PATH, 'utf-8');
    return JSON.parse(raw) as HoursConfig;
  } catch {
    return null;
  }
}

async function saveToFile(config: HoursConfig): Promise<boolean> {
  try {
    const dir = join(process.cwd(), 'data');
    await mkdir(dir, { recursive: true });
    await writeFile(FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Get opening hours. Tries Upstash first (if configured), then file, then static.
 */
export async function getHoursConfig(): Promise<HoursConfig> {
  const fromUpstash = await getFromUpstash();
  if (fromUpstash) return fromUpstash;

  const fromFile = await getFromFile();
  if (fromFile) return fromFile;

  return staticHours;
}

/**
 * Save opening hours. Tries Upstash first (if configured), then file.
 * Returns { ok: true } on success, or { ok: false, error: string } on failure.
 */
export async function saveHoursConfig(
  config: HoursConfig
): Promise<{ ok: true } | { ok: false; error: string }> {
  const updated = {
    ...config,
    lastUpdated: new Date().toISOString(),
  };

  if (isUpstashConfigured()) {
    const saved = await saveToUpstash(updated);
    if (saved) return { ok: true };
  }

  const fileSaved = await saveToFile(updated);
  if (fileSaved) return { ok: true };

  return {
    ok: false,
    error:
      'Could not save. For Vercel/serverless, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. For self-hosted, ensure the data/ directory is writable.',
  };
}

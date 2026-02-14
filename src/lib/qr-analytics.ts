/**
 * Code-tag (qr) analytics: record landings and read counts for dashboard.
 * Uses Upstash Redis when configured; no-op otherwise.
 */

const CODE_PATTERN = /^[A-Za-z0-9]{4}$/;
const REDIS_CODES_SET = 'qr:codes';
const REDIS_COUNT_PREFIX = 'qr:count:';

let devLoggedNoRedis = false;

function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function getRedis() {
  const { Redis } = await import('@upstash/redis');
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/**
 * Validates that the string is exactly 4 alphanumeric characters.
 */
export function isValidQrCode(code: string): boolean {
  return CODE_PATTERN.test(code);
}

/**
 * Record a landing with the given qr code. No-op if Upstash is not configured
 * or code is invalid.
 */
export async function recordQrHit(code: string): Promise<void> {
  if (!isValidQrCode(code)) return;
  if (!isUpstashConfigured()) {
    if (process.env.NODE_ENV === 'development' && !devLoggedNoRedis) {
      devLoggedNoRedis = true;
      console.warn(
        '[qr-analytics] recordQrHit skipped: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local to store code-tag counts'
      );
    }
    return;
  }

  try {
    const redis = await getRedis();
    await redis.sadd(REDIS_CODES_SET, code);
    await redis.incr(`${REDIS_COUNT_PREFIX}${code}`);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[qr-analytics] recordQrHit failed:', err);
    }
  }
}

export type QrCountEntry = { code: string; count: number };

/**
 * Return all known codes and their hit counts. Empty array if Upstash not configured.
 */
export async function getQrCounts(): Promise<QrCountEntry[]> {
  if (!isUpstashConfigured()) return [];

  try {
    const redis = await getRedis();
    const codes = await redis.smembers<string[]>(REDIS_CODES_SET);
    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return [];
    }

    const entries: QrCountEntry[] = [];
    for (const code of codes) {
      const count = await redis.get<number>(`${REDIS_COUNT_PREFIX}${code}`);
      entries.push({
        code: String(code),
        count: typeof count === 'number' ? count : 0,
      });
    }

    entries.sort((a, b) => b.count - a.count);
    return entries;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[qr-analytics] getQrCounts failed:', err);
    }
    return [];
  }
}

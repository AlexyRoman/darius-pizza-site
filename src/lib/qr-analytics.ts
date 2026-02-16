/**
 * Code-tag (QR) analytics: record hits and fetch counts from Upstash Redis.
 * See docs/dashboard-analysis/07-code-tags-analytics.md
 */

const CODE_PATTERN = /^[A-Za-z0-9]{4}$/;
const REDIS_KEY_PREFIX = 'qr:count:';

function isUpstashConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

function validateCode(code: string): boolean {
  return typeof code === 'string' && CODE_PATTERN.test(code.trim());
}

/**
 * Record a QR code hit. Increments the counter in Upstash Redis.
 * Caller (API route) must handle cookie dedupe before calling this.
 */
export async function recordQrHit(
  code: string,
  _request?: Request
): Promise<void> {
  const trimmed = code?.trim();
  if (!validateCode(trimmed)) {
    return;
  }

  if (!isUpstashConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[qr-analytics] Upstash not configured, skipping record');
    }
    return;
  }

  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    await redis.incr(`${REDIS_KEY_PREFIX}${trimmed}`);

    const externalUrl = process.env.QR_ANALYTICS_EXTERNAL_URL;
    if (externalUrl) {
      fetch(externalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: trimmed,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[qr-analytics] recordQrHit failed:', err);
    }
    throw err;
  }
}

/**
 * Get all code counts from Redis. Returns array sorted by count descending.
 */
export async function getQrCounts(): Promise<
  { code: string; count: number }[]
> {
  if (!isUpstashConfigured()) {
    return [];
  }

  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const keys = await redis.keys(`${REDIS_KEY_PREFIX}*`);
    if (!keys || keys.length === 0) {
      return [];
    }

    const counts = await redis.mget<number[]>(...keys);
    const result: { code: string; count: number }[] = keys.map((key, i) => {
      const code = key.replace(REDIS_KEY_PREFIX, '');
      const count = typeof counts[i] === 'number' ? counts[i]! : 0;
      return { code, count };
    });

    result.sort((a, b) => b.count - a.count);
    return result;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[qr-analytics] getQrCounts failed:', err);
    }
    return [];
  }
}

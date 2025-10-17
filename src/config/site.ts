import { env } from '@/lib/env';

export function getSiteTimeZone(): string {
  return env.SITE_TIME_ZONE;
}

export function getSitePhone(): string {
  return env.SITE_PHONE;
}

/**
 * Google Business Profile sync — regular hours and special hours (closings).
 * Server-only. Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN,
 * GOOGLE_LOCATION_NAME; set GOOGLE_SYNC_ENABLED=true to enable PATCH.
 */

import type { ClosingsConfig, HoursConfig } from '@/types/restaurant-config';

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const GBP_DAY: Record<(typeof DAY_ORDER)[number], string> = {
  monday: 'MONDAY',
  tuesday: 'TUESDAY',
  wednesday: 'WEDNESDAY',
  thursday: 'THURSDAY',
  friday: 'FRIDAY',
  saturday: 'SATURDAY',
  sunday: 'SUNDAY',
};

function isGoogleSyncConfigured(): boolean {
  const enabled =
    process.env.GOOGLE_SYNC_ENABLED?.trim().toLowerCase() === 'true';
  return (
    enabled &&
    !!process.env.GOOGLE_CLIENT_ID &&
    !!process.env.GOOGLE_CLIENT_SECRET &&
    !!process.env.GOOGLE_REFRESH_TOKEN &&
    !!process.env.GOOGLE_LOCATION_NAME
  );
}

/** Parse "HH:mm" into GBP TimeOfDay (hours 0-23, 24:00 as 24). */
function timeToTimeOfDay(hhmm: string): { hours: number; minutes: number } {
  const [h, m] = hhmm.split(':').map(s => parseInt(s, 10));
  const hours = Number.isFinite(h) ? h : 0;
  const minutes = Number.isFinite(m) ? m : 0;
  return { hours, minutes };
}

/**
 * Build GBP regularHours.periods from our HoursConfig.
 * Closed days are omitted. Each open period becomes one TimePeriod (same open/close day).
 */
export function hoursConfigToGBPRegularHours(config: HoursConfig): {
  periods: Array<{
    openDay: string;
    openTime: {
      hours: number;
      minutes: number;
      seconds?: number;
      nanos?: number;
    };
    closeDay: string;
    closeTime: {
      hours: number;
      minutes: number;
      seconds?: number;
      nanos?: number;
    };
  }>;
} {
  const periods: Array<{
    openDay: string;
    openTime: {
      hours: number;
      minutes: number;
      seconds?: number;
      nanos?: number;
    };
    closeDay: string;
    closeTime: {
      hours: number;
      minutes: number;
      seconds?: number;
      nanos?: number;
    };
  }> = [];

  for (const day of DAY_ORDER) {
    const d = config.openingHours[day];
    if (!d?.isOpen || !Array.isArray(d.periods)) continue;
    for (const p of d.periods) {
      const open = timeToTimeOfDay(p.open ?? '00:00');
      const close = timeToTimeOfDay(p.close ?? '23:59');
      const gbpDay = GBP_DAY[day];
      periods.push({
        openDay: gbpDay,
        openTime: {
          hours: open.hours,
          minutes: open.minutes,
          seconds: 0,
          nanos: 0,
        },
        closeDay: gbpDay,
        closeTime: {
          hours: close.hours,
          minutes: close.minutes,
          seconds: 0,
          nanos: 0,
        },
      });
    }
  }

  return { periods };
}

/** Max consecutive closed days we send per closing (GBP constraint). */
const MAX_SPECIAL_HOUR_DAYS = 5;

/**
 * Build GBP specialHours.specialHourPeriods from ClosingsConfig.
 * Only active scheduled closings; one period per closed day, closed: true; max 5 days per closing.
 */
export function closingsConfigToGBPSpecialHours(config: ClosingsConfig): {
  specialHourPeriods: Array<{
    startDate: { year: number; month: number; day: number };
    closed?: boolean;
  }>;
} {
  const specialHourPeriods: Array<{
    startDate: { year: number; month: number; day: number };
    closed?: boolean;
  }> = [];

  const active = (config.scheduledClosings ?? []).filter(c => c.isActive);
  for (const closing of active) {
    const start = parseISOToDateParts(closing.startDate);
    if (!start) continue;
    const startDate = new Date(closing.startDate);
    const endDate = new Date(closing.endDate);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()))
      continue;
    const daysDiff =
      Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1;
    const daysToSend = Math.min(Math.max(1, daysDiff), MAX_SPECIAL_HOUR_DAYS);
    for (let i = 0; i < daysToSend; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      specialHourPeriods.push({
        startDate: {
          year: d.getFullYear(),
          month: d.getMonth() + 1,
          day: d.getDate(),
        },
        closed: true,
      });
    }
  }

  return { specialHourPeriods };
}

function parseISOToDateParts(
  iso: string
): { year: number; month: number; day: number } | null {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  } catch {
    return null;
  }
}

/**
 * Refresh access token using GOOGLE_REFRESH_TOKEN. Returns null if not configured or on error.
 */
export async function refreshAccessToken(): Promise<string | null> {
  if (!isGoogleSyncConfigured()) return null;
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN!;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = (await res.json()) as {
      access_token?: string;
      error?: string;
    };
    if (!res.ok) {
      console.error(
        '[GBP] Token refresh failed:',
        data.error ?? res.statusText
      );
      return null;
    }
    return data.access_token ?? null;
  } catch (err) {
    console.error('[GBP] Token refresh error:', err);
    return null;
  }
}

const GBP_BASE = 'https://mybusinessbusinessinformation.googleapis.com/v1';

export type SyncResult = { ok: boolean; error?: string; skipped?: true };

/**
 * Sync regular hours to Google Business Profile. No-op if not configured.
 */
export async function syncRegularHours(
  hoursConfig: HoursConfig
): Promise<SyncResult> {
  if (!isGoogleSyncConfigured()) {
    console.log(
      '[GBP] syncRegularHours skipped — not configured (set GOOGLE_SYNC_ENABLED=true and GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_LOCATION_NAME in .env.local)'
    );
    return { ok: true, skipped: true };
  }

  const token = await refreshAccessToken();
  if (!token) return { ok: false, error: 'token_refresh_failed' };

  const locationName = process.env.GOOGLE_LOCATION_NAME!.trim();
  const url = `${GBP_BASE}/${locationName}?updateMask=regularHours`;
  const regularHours = hoursConfigToGBPRegularHours(hoursConfig);

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ regularHours }),
    });

    if (!res.ok) {
      const text = await res.text();
      let errMsg: string;
      try {
        const j = JSON.parse(text) as { error?: { message?: string } };
        errMsg = j.error?.message ?? text;
      } catch {
        errMsg = text || res.statusText;
      }
      console.error('[GBP] syncRegularHours failed:', res.status, errMsg);
      return { ok: false, error: errMsg };
    }
    console.log('[GBP] syncRegularHours OK — location updated');
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[GBP] syncRegularHours error:', err);
    return { ok: false, error: message };
  }
}

/**
 * Sync special hours (closings) to Google Business Profile. No-op if not configured.
 */
export async function syncSpecialHours(
  closingsConfig: ClosingsConfig,
  _locale?: string
): Promise<SyncResult> {
  if (!isGoogleSyncConfigured()) {
    console.log(
      '[GBP] syncSpecialHours skipped — not configured (set GOOGLE_SYNC_ENABLED=true and GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_LOCATION_NAME in .env.local)'
    );
    return { ok: true, skipped: true };
  }

  const token = await refreshAccessToken();
  if (!token) return { ok: false, error: 'token_refresh_failed' };

  const locationName = process.env.GOOGLE_LOCATION_NAME!.trim();
  const url = `${GBP_BASE}/${locationName}?updateMask=specialHours`;
  const specialHours = closingsConfigToGBPSpecialHours(closingsConfig);

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ specialHours }),
    });

    if (!res.ok) {
      const text = await res.text();
      let errMsg: string;
      try {
        const j = JSON.parse(text) as { error?: { message?: string } };
        errMsg = j.error?.message ?? text;
      } catch {
        errMsg = text || res.statusText;
      }
      console.error('[GBP] syncSpecialHours failed:', res.status, errMsg);
      return { ok: false, error: errMsg };
    }
    console.log('[GBP] syncSpecialHours OK — location updated');
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[GBP] syncSpecialHours error:', err);
    return { ok: false, error: message };
  }
}

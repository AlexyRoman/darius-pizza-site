import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { getClosingsConfig, saveClosingsConfig } from '@/lib/closings-storage';
import { isAuthenticated } from '@/lib/auth';
import { syncSpecialHours } from '@/lib/google-business-profile';
import type { ClosingsConfig } from '@/types/restaurant-config';

const DASHBOARD_LOCALES = ['en', 'fr'] as const;

function validateClosingsConfig(body: unknown): body is ClosingsConfig {
  if (!body || typeof body !== 'object') return false;
  const o = body as Record<string, unknown>;
  if (!Array.isArray(o.scheduledClosings)) return false;
  if (!Array.isArray(o.emergencyClosings)) return false;
  return true;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') || 'en';
  const safeLocale = DASHBOARD_LOCALES.includes(
    locale as (typeof DASHBOARD_LOCALES)[number]
  )
    ? locale
    : 'en';

  try {
    const config = await getClosingsConfig(safeLocale);
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    });
  } catch (err) {
    console.error('GET /api/closings:', err);
    return NextResponse.json(
      { error: 'Failed to load closings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const locale = (body.locale as string) || 'en';
    const safeLocale = DASHBOARD_LOCALES.includes(
      locale as (typeof DASHBOARD_LOCALES)[number]
    )
      ? locale
      : 'en';

    const { locale: _l, ...config } = body;
    void _l;
    if (!validateClosingsConfig(config)) {
      return NextResponse.json(
        { error: 'Invalid closings format' },
        { status: 400 }
      );
    }

    const result = await saveClosingsConfig(
      safeLocale,
      config as ClosingsConfig
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    revalidatePath('/api/closings');
    revalidatePath('/', 'layout');

    let googleSync: 'ok' | 'skipped' | 'failed' = 'skipped';
    let googleSyncError: string | undefined;
    try {
      const syncResult = await syncSpecialHours(
        config as ClosingsConfig,
        safeLocale
      );
      if (syncResult.skipped) googleSync = 'skipped';
      else if (syncResult.ok) googleSync = 'ok';
      else {
        googleSync = 'failed';
        googleSyncError = syncResult.error;
      }
    } catch (syncErr) {
      googleSync = 'failed';
      googleSyncError =
        syncErr instanceof Error ? syncErr.message : 'Unknown error';
    }

    return NextResponse.json({
      success: true,
      googleSync,
      ...(googleSyncError && { googleSyncError }),
    });
  } catch (err) {
    console.error('PUT /api/closings:', err);
    return NextResponse.json(
      { error: 'Failed to save closings' },
      { status: 500 }
    );
  }
}

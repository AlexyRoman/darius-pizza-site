import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { getClosingsConfig, saveClosingsConfig } from '@/lib/closings-storage';
import { isAuthenticated } from '@/lib/auth';
import type { ClosingsConfig } from '@/types/restaurant-config';

const CACHE_MAX_AGE = 3600;
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
        'Cache-Control': `s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate`,
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
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT /api/closings:', err);
    return NextResponse.json(
      { error: 'Failed to save closings' },
      { status: 500 }
    );
  }
}

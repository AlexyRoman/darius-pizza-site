import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { getHoursConfig, saveHoursConfig } from '@/lib/hours-storage';
import { isAuthenticated } from '@/lib/auth';
import type { HoursConfig } from '@/types/restaurant-config';

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

function validateHoursConfig(body: unknown): body is HoursConfig {
  if (!body || typeof body !== 'object') return false;
  const o = body as Record<string, unknown>;
  if (!o.openingHours || typeof o.openingHours !== 'object') return false;
  const hours = o.openingHours as Record<string, unknown>;
  for (const day of DAYS) {
    const d = hours[day];
    if (!d || typeof d !== 'object') return false;
    const dayObj = d as Record<string, unknown>;
    if (typeof dayObj.isOpen !== 'boolean') return false;
    if (!Array.isArray(dayObj.periods)) return false;
    for (const p of dayObj.periods) {
      if (
        !p ||
        typeof p !== 'object' ||
        typeof (p as Record<string, unknown>).open !== 'string' ||
        typeof (p as Record<string, unknown>).close !== 'string'
      )
        return false;
    }
  }
  return true;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getHoursConfig();
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    });
  } catch (err) {
    console.error('GET /api/hours:', err);
    return NextResponse.json(
      { error: 'Failed to load opening hours' },
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
    if (!validateHoursConfig(body)) {
      return NextResponse.json(
        { error: 'Invalid opening hours format' },
        { status: 400 }
      );
    }

    const result = await saveHoursConfig(body as HoursConfig);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    revalidatePath('/api/hours');
    revalidatePath('/', 'layout');
    const saved = await getHoursConfig();
    return NextResponse.json({ success: true, config: saved });
  } catch (err) {
    console.error('PUT /api/hours:', err);
    return NextResponse.json(
      { error: 'Failed to save opening hours' },
      { status: 500 }
    );
  }
}

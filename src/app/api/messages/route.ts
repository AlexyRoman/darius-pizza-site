import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { getMessagesConfig, saveMessagesConfig } from '@/lib/messages-storage';
import { isAuthenticated } from '@/lib/auth';
import type { MessagesConfig } from '@/types/restaurant-config';

const DASHBOARD_LOCALES = ['en', 'fr'] as const;

function validateMessagesConfig(body: unknown): body is MessagesConfig {
  if (!body || typeof body !== 'object') return false;
  const o = body as Record<string, unknown>;
  if (!Array.isArray(o.specialMessages)) return false;
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
    const config = await getMessagesConfig(safeLocale);
    return NextResponse.json(config, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
      },
    });
  } catch (err) {
    console.error('GET /api/messages:', err);
    return NextResponse.json(
      { error: 'Failed to load messages' },
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
    if (!validateMessagesConfig(config)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const result = await saveMessagesConfig(
      safeLocale,
      config as MessagesConfig
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    revalidatePath('/api/messages');
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT /api/messages:', err);
    return NextResponse.json(
      { error: 'Failed to save messages' },
      { status: 500 }
    );
  }
}

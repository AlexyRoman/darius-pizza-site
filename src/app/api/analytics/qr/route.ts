import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { recordQrHit } from '@/lib/qr-analytics';

const CODE_PATTERN = /^[A-Za-z0-9]{4}$/;
const COOKIE_NAME = 'qr_counted';
const COOKIE_MAX_AGE = 86400; // 1 day
const MAX_CODES_IN_COOKIE = 10;

function validateCode(code: string): boolean {
  return typeof code === 'string' && CODE_PATTERN.test(code.trim());
}

function parseCountedCodes(cookieValue: string | undefined): string[] {
  if (!cookieValue || typeof cookieValue !== 'string') return [];
  return cookieValue
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function buildNewCookieValue(existing: string[], code: string): string {
  const trimmed = code.trim();
  const without = existing.filter(c => c !== trimmed);
  const next = [...without, trimmed].slice(-MAX_CODES_IN_COOKIE);
  return next.join(',');
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code || !validateCode(code)) {
    return NextResponse.json(
      { error: 'Invalid or missing code' },
      { status: 400 }
    );
  }

  const trimmed = code.trim();
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(COOKIE_NAME);
  const counted = parseCountedCodes(existingCookie?.value);

  if (counted.includes(trimmed)) {
    return new NextResponse(null, { status: 200 });
  }

  await recordQrHit(trimmed, request);

  const newValue = buildNewCookieValue(counted, trimmed);
  const response = new NextResponse(null, { status: 200 });
  response.cookies.set(COOKIE_NAME, newValue, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
}

export async function POST(request: NextRequest) {
  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const code = typeof body?.code === 'string' ? body.code : '';
  if (!validateCode(code)) {
    return NextResponse.json(
      { error: 'Invalid or missing code' },
      { status: 400 }
    );
  }

  const trimmed = code.trim();
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(COOKIE_NAME);
  const counted = parseCountedCodes(existingCookie?.value);

  if (counted.includes(trimmed)) {
    return new NextResponse(null, { status: 200 });
  }

  await recordQrHit(trimmed, request);

  const newValue = buildNewCookieValue(counted, trimmed);
  const response = new NextResponse(null, { status: 200 });
  response.cookies.set(COOKIE_NAME, newValue, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
}

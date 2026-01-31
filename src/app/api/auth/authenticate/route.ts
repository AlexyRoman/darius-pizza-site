import { timingSafeEqual } from 'node:crypto';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

const AUTH_COOKIE_MAX_AGE = 60 * 60; // 1 hour in seconds
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 10;

const rateLimit = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let r = rateLimit.get(ip);
  if (!r || now > r.resetAt) {
    r = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimit.set(ip, r);
  }
  r.count++;
  return r.count <= RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const password = typeof body?.password === 'string' ? body.password : '';

    const expectedPassword = process.env.PAGE_ACCESS_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    const passwordBuffer = Buffer.from(password, 'utf8');
    const expectedBuffer = Buffer.from(expectedPassword, 'utf8');
    if (
      passwordBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(passwordBuffer, expectedBuffer)
    ) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

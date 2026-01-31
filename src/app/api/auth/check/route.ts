import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_NAME);

  if (authToken?.value === 'authenticated') {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}

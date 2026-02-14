import { NextResponse, type NextRequest } from 'next/server';

/** Path pattern: /q/ exactly followed by 4 alphanumeric characters */
const Q_PATH_REGEX = /^\/q\/([A-Za-z0-9]{4})$/;

/** Default target path for redirect (locale will be applied by next-intl) */
const DEFAULT_TARGET_PATH = '/';

/** HTTP status for redirect (temporary so query param is re-sent) */
const REDIRECT_STATUS = 302;

type RequestLike = Pick<NextRequest, 'url' | 'nextUrl'>;

/**
 * Resolves /q/XXXX short links: redirects to the default target with ?qr=XXXX
 * and preserves any existing query parameters. Accepts any 4-character
 * alphanumeric code (no config lookup).
 *
 * @param request - Next request or request-like with url and nextUrl
 * @returns NextResponse.redirect with target URL including qr=code, or null if path does not match
 */
export function resolveQRedirect(request: NextRequest): NextResponse | null;
export function resolveQRedirect(request: RequestLike): NextResponse | null;
export function resolveQRedirect(request: RequestLike): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;
  const match = pathname.match(Q_PATH_REGEX);
  if (!match) {
    return null;
  }

  const code = match[1];
  const url = new URL(request.url);
  const targetUrl = new URL(DEFAULT_TARGET_PATH, url.origin);

  targetUrl.searchParams.set('qr', code);

  for (const [key, value] of searchParams.entries()) {
    if (!targetUrl.searchParams.has(key)) {
      targetUrl.searchParams.set(key, value);
    }
  }

  return NextResponse.redirect(targetUrl, REDIRECT_STATUS);
}

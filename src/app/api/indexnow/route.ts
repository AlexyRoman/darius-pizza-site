import { NextRequest, NextResponse } from 'next/server';
import { getSitemapUrlList, submitIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * POST /api/indexnow
 * Submits all sitemap URLs (+ sitemap.xml) to IndexNow (Bing, Yandex, Edge).
 * Optional: ?secret=INDEXNOW_SUBMIT_SECRET if you set that env var.
 */
export async function POST(request: NextRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dariuspizza.fr';
  const key = process.env.INDEXNOW_KEY;
  const secret = process.env.INDEXNOW_SUBMIT_SECRET;

  if (secret) {
    const provided = request.nextUrl.searchParams.get('secret');
    if (provided !== secret) {
      return NextResponse.json(
        { error: 'Unauthorized', ok: false },
        { status: 401 }
      );
    }
  }

  if (!key) {
    return NextResponse.json(
      {
        ok: false,
        error: 'INDEXNOW_KEY is not set',
      },
      { status: 500 }
    );
  }

  try {
    const base = baseUrl.replace(/\/$/, '');
    const host = new URL(baseUrl).hostname;
    const keyLocation = `${base}/${key}.txt`;

    const pageUrls = getSitemapUrlList(baseUrl);
    const sitemapUrl = `${base}/sitemap.xml`;
    const urlList =
      pageUrls.indexOf(sitemapUrl) === -1
        ? [...pageUrls, sitemapUrl]
        : pageUrls;

    const response = await submitIndexNow({
      host,
      key,
      keyLocation,
      urlList,
    });

    const status = response.status;
    const body = await response.text();
    let data: unknown;
    try {
      data = body ? JSON.parse(body) : {};
    } catch {
      data = { raw: body };
    }

    if (status >= 400) {
      return NextResponse.json(
        {
          ok: false,
          status,
          submitted: urlList.length,
          indexNowResponse: data,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      status,
      submitted: urlList.length,
      indexNowResponse: data,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

import { NextResponse, type NextRequest } from 'next/server';

import {
  findCampaignByCode,
  getCampaignsConfig,
} from '@/config/generic/campaigns-config';

type RequestLike = Pick<NextRequest, 'url' | 'nextUrl'>;

// Overloads so the function is ergonomic in middleware and easy to test
export function resolveCampaignRedirect(
  request: NextRequest
): NextResponse | null;
export function resolveCampaignRedirect(
  request: RequestLike
): NextResponse | null;
export function resolveCampaignRedirect(
  request: RequestLike
): NextResponse | null {
  const config = getCampaignsConfig();

  if (!config.enabled) {
    return null;
  }

  const { pathname, searchParams } = request.nextUrl;

  // Match /q/XXXX where XXXX is exactly 4 alphanumeric characters
  const match = pathname.match(/^\/q\/([A-Za-z0-9]{4})$/);
  if (!match) {
    return null;
  }

  const code = match[1];
  const campaign = findCampaignByCode(code);

  if (!campaign) {
    return null;
  }

  const url = new URL(request.url);
  const targetUrl = new URL(campaign.target, url.origin);

  // Preserve original query parameters without overwriting explicit ones
  for (const [key, value] of searchParams.entries()) {
    if (!targetUrl.searchParams.has(key)) {
      targetUrl.searchParams.set(key, value);
    }
  }

  const status = campaign.status ?? config.defaultStatus ?? 302;

  return NextResponse.redirect(targetUrl, status);
}

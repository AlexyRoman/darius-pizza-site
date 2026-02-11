import { resolveCampaignRedirect } from '../campaignRedirects';

// Lightweight mock matching the RequestLike shape used by the resolver
function createRequest(url: string) {
  const nextUrl = new URL(url);
  return { url, nextUrl };
}

describe('resolveCampaignRedirect', () => {
  it('returns null for non-matching paths', () => {
    const res = resolveCampaignRedirect(
      // @ts-expect-error - using lightweight test request
      createRequest('https://example.com/q/TOO-LONG')
    );
    expect(res).toBeNull();
  });

  it('redirects /q/DEMO to /en', () => {
    const res = resolveCampaignRedirect(
      // @ts-expect-error - using lightweight test request
      createRequest('https://example.com/q/DEMO')
    );

    expect(res).not.toBeNull();
    expect(res?.status).toBe(302);

    const location = res?.headers.get('location');
    expect(location).toBe('https://example.com/en');
  });

  it('preserves query parameters on redirect', () => {
    const res = resolveCampaignRedirect(
      // @ts-expect-error - using lightweight test request
      createRequest('https://example.com/q/DEMO?ref=flyer&lang=fr')
    );

    expect(res).not.toBeNull();
    const location = res?.headers.get('location');
    expect(location).toBeDefined();

    const url = new URL(location as string);
    expect(url.pathname).toBe('/en');
    expect(url.searchParams.get('ref')).toBe('flyer');
    expect(url.searchParams.get('lang')).toBe('fr');

    // Ensure no extra tracking params were injected
    for (const [key] of url.searchParams.entries()) {
      expect(key.startsWith('utm_')).toBe(false);
    }
  });
});

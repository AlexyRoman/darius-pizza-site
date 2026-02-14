import { resolveQRedirect } from '../qRedirect';

function createRequest(url: string) {
  const nextUrl = new URL(url);
  return { url, nextUrl };
}

describe('resolveQRedirect', () => {
  it('returns null for non-matching paths', () => {
    expect(
      resolveQRedirect(
        // @ts-expect-error - using lightweight test request
        createRequest('https://example.com/')
      )
    ).toBeNull();
    expect(
      resolveQRedirect(
        // @ts-expect-error - using lightweight test request
        createRequest('https://example.com/q/TOO-LONG')
      )
    ).toBeNull();
    expect(
      resolveQRedirect(
        // @ts-expect-error - using lightweight test request
        createRequest('https://example.com/q/AB')
      )
    ).toBeNull();
    expect(
      resolveQRedirect(
        // @ts-expect-error - using lightweight test request
        createRequest('https://example.com/q/ABCDE')
      )
    ).toBeNull();
    expect(
      resolveQRedirect(
        // @ts-expect-error - using lightweight test request
        createRequest('https://example.com/q/AB-1')
      )
    ).toBeNull();
  });

  it('redirects any /q/XXXX to / with qr=XXXX', () => {
    const res = resolveQRedirect(
      // @ts-expect-error - using lightweight test request
      createRequest('https://example.com/q/DEMO')
    );

    expect(res).not.toBeNull();
    expect(res?.status).toBe(302);

    const location = res?.headers.get('location');
    expect(location).toBe('https://example.com/?qr=DEMO');
  });

  it('accepts any 4-alphanumeric code (dynamic)', () => {
    const codes = ['DEMO', 'BT26', 'XY99', 'ab12', 'Z9z9'];
    for (const code of codes) {
      const res = resolveQRedirect(
        // @ts-expect-error - using lightweight test request
        createRequest(`https://example.com/q/${code}`)
      );
      expect(res).not.toBeNull();
      const location = res?.headers.get('location');
      const url = new URL(location as string);
      expect(url.searchParams.get('qr')).toBe(code);
    }
  });

  it('preserves existing query parameters and adds qr', () => {
    const res = resolveQRedirect(
      // @ts-expect-error - using lightweight test request
      createRequest('https://example.com/q/DEMO?ref=flyer&lang=fr')
    );

    expect(res).not.toBeNull();
    const location = res?.headers.get('location');
    const url = new URL(location as string);
    expect(url.pathname).toBe('/');
    expect(url.searchParams.get('qr')).toBe('DEMO');
    expect(url.searchParams.get('ref')).toBe('flyer');
    expect(url.searchParams.get('lang')).toBe('fr');
  });

  it('does not overwrite qr if already in query', () => {
    const res = resolveQRedirect(
      // @ts-expect-error - using lightweight test request
      createRequest('https://example.com/q/NEW1?qr=old')
    );
    const url = new URL(res!.headers.get('location')!);
    expect(url.searchParams.get('qr')).toBe('NEW1');
  });
});

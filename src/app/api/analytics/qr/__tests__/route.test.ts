/** @jest-environment node */

import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/analytics/qr/route';

const mockRecordQrHit = jest.fn();
const mockCookiesGet = jest.fn();

jest.mock('@/lib/qr-analytics', () => ({
  recordQrHit: (...args: unknown[]) => mockRecordQrHit(...args),
}));

jest.mock('next/headers', () => ({
  cookies: () =>
    Promise.resolve({
      get: mockCookiesGet,
    }),
}));

function createGetRequest(url: string): NextRequest {
  return new NextRequest(url);
}

describe('GET /api/analytics/qr', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockCookiesGet.mockReturnValue(undefined);
  });

  it('returns 400 when code is missing', async () => {
    const req = createGetRequest('http://localhost/api/analytics/qr');
    const res = await GET(req);
    expect(res.status).toBe(400);
    expect(mockRecordQrHit).not.toHaveBeenCalled();
  });

  it('returns 400 when code is invalid', async () => {
    const req = createGetRequest('http://localhost/api/analytics/qr?code=AB');
    const res = await GET(req);
    expect(res.status).toBe(400);
    expect(mockRecordQrHit).not.toHaveBeenCalled();
  });

  it('calls recordQrHit and sets cookie when code valid and not in cookie', async () => {
    mockCookiesGet.mockReturnValue(undefined);

    const req = createGetRequest('http://localhost/api/analytics/qr?code=DEMO');
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(mockRecordQrHit).toHaveBeenCalledWith('DEMO', expect.any(Request));
    const setCookieHeader = res.headers.get('set-cookie');
    expect(setCookieHeader).toContain('qr_counted');
    expect(setCookieHeader).toContain('DEMO');
    expect(setCookieHeader).toMatch(/max-age=86400|Max-Age=86400/);
  });

  it('does not call recordQrHit when code already in cookie', async () => {
    mockCookiesGet.mockReturnValue({ value: 'DEMO' });

    const req = createGetRequest('http://localhost/api/analytics/qr?code=DEMO');
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(mockRecordQrHit).not.toHaveBeenCalled();
  });

  it('calls recordQrHit and appends to cookie when cookie has other codes', async () => {
    mockCookiesGet.mockReturnValue({ value: 'BT26' });

    const req = createGetRequest('http://localhost/api/analytics/qr?code=DEMO');
    const res = await GET(req);

    expect(res.status).toBe(200);
    expect(mockRecordQrHit).toHaveBeenCalledWith('DEMO', expect.any(Request));
    const setCookieHeader = res.headers.get('set-cookie');
    expect(setCookieHeader).toContain('qr_counted');
    expect(setCookieHeader).toMatch(/DEMO|BT26/);
  });
});

describe('POST /api/analytics/qr', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockCookiesGet.mockReturnValue(undefined);
  });

  it('returns 400 when body has no code', async () => {
    const req = new NextRequest('http://localhost/api/analytics/qr', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockRecordQrHit).not.toHaveBeenCalled();
  });

  it('returns 400 when body has invalid code', async () => {
    const req = new NextRequest('http://localhost/api/analytics/qr', {
      method: 'POST',
      body: JSON.stringify({ code: 'X' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockRecordQrHit).not.toHaveBeenCalled();
  });

  it('calls recordQrHit when body has valid code', async () => {
    const req = new NextRequest('http://localhost/api/analytics/qr', {
      method: 'POST',
      body: JSON.stringify({ code: 'DEMO' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockRecordQrHit).toHaveBeenCalledWith('DEMO', expect.any(Request));
  });
});

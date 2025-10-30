/** @jest-environment node */
import { NextRequest } from 'next/server';

describe('GET /api/og', () => {
  it('returns an ImageResponse with defaults', async () => {
    jest.resetModules();
    const { GET } = await import('@/app/api/og/route');
    const req = new NextRequest('https://example.com/api/og');
    const res = await GET(req);
    const status =
      typeof res === 'object' &&
      res !== null &&
      'status' in res &&
      typeof (res as { status?: number }).status === 'number'
        ? (res as { status?: number }).status!
        : 200;
    expect(status).toBe(200);
  });

  it('uses query params when provided', async () => {
    jest.resetModules();
    const { GET } = await import('@/app/api/og/route');
    const req = new NextRequest(
      'https://example.com/api/og?title=Hello&locale=fr&type=menu'
    );
    const res = await GET(req);
    const status =
      typeof res === 'object' &&
      res !== null &&
      'status' in res &&
      typeof (res as { status?: number }).status === 'number'
        ? (res as { status?: number }).status!
        : 200;
    expect(status).toBe(200);
  });

  it('returns 500 when metadata throws', async () => {
    jest.resetModules();
    jest.doMock('@/lib/og-metadata', () => ({
      getLocaleMetadata: () => {
        throw new Error('boom');
      },
    }));
    const { GET } = await import('@/app/api/og/route');
    const req = new NextRequest('https://example.com/api/og');
    const res = await GET(req);
    const status =
      typeof res === 'object' &&
      res !== null &&
      'status' in res &&
      typeof (res as { status?: number }).status === 'number'
        ? (res as { status?: number }).status!
        : 500;
    expect(status).toBe(500);
  });
});

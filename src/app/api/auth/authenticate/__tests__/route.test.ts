/** @jest-environment node */

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { POST } from '@/app/api/auth/authenticate/route';

const mockCookiesSet = jest.fn();

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

const originalEnv = process.env;

describe('POST /api/auth/authenticate', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
    (cookies as jest.Mock).mockResolvedValue({
      get: jest.fn(),
      set: mockCookiesSet,
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function request(body: unknown, ip = '127.0.0.1') {
    return {
      json: async () => body,
      headers: {
        get: (name: string) => (name === 'x-forwarded-for' ? ip : null),
      },
    } as unknown as NextRequest;
  }

  it('returns 400 when body is invalid (json throws)', async () => {
    const req = {
      json: async () => {
        throw new Error('parse error');
      },
      headers: { get: () => '127.0.0.2' },
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid request');
  });

  it('returns 500 when PAGE_ACCESS_USERNAME is not set', async () => {
    process.env.PAGE_ACCESS_USERNAME = '';
    process.env.PAGE_ACCESS_PASSWORD = 'secret';

    const req = request({ username: 'user', password: 'secret' }, '127.0.0.3');
    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Authentication not configured');
    expect(mockCookiesSet).not.toHaveBeenCalled();
  });

  it('returns 500 when PAGE_ACCESS_PASSWORD is not set', async () => {
    process.env.PAGE_ACCESS_USERNAME = 'admin';
    process.env.PAGE_ACCESS_PASSWORD = '';

    const req = request({ username: 'admin', password: 'secret' }, '127.0.0.4');
    const res = await POST(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Authentication not configured');
  });

  it('returns 401 for wrong username', async () => {
    process.env.PAGE_ACCESS_USERNAME = 'admin';
    process.env.PAGE_ACCESS_PASSWORD = 'secret123';

    const req = request(
      { username: 'wrong', password: 'secret123' },
      '127.0.0.5'
    );
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Invalid username or password');
    expect(mockCookiesSet).not.toHaveBeenCalled();
  });

  it('returns 401 for wrong password', async () => {
    process.env.PAGE_ACCESS_USERNAME = 'admin';
    process.env.PAGE_ACCESS_PASSWORD = 'secret123';

    const req = request({ username: 'admin', password: 'wrong' }, '127.0.0.6');
    const res = await POST(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Invalid username or password');
    expect(mockCookiesSet).not.toHaveBeenCalled();
  });

  it('returns 200 and sets cookie for correct credentials', async () => {
    process.env.PAGE_ACCESS_USERNAME = 'admin';
    process.env.PAGE_ACCESS_PASSWORD = 'secret123';

    const req = request(
      { username: 'admin', password: 'secret123' },
      '127.0.0.7'
    );
    const res = await POST(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mockCookiesSet).toHaveBeenCalledWith(
      'authToken',
      'authenticated',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      })
    );
  });

  it('trims username before comparison', async () => {
    process.env.PAGE_ACCESS_USERNAME = 'admin';
    process.env.PAGE_ACCESS_PASSWORD = 'secret123';

    const req = request(
      { username: '  admin  ', password: 'secret123' },
      '127.0.0.8'
    );
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockCookiesSet).toHaveBeenCalled();
  });
});

/** @jest-environment node */

import { cookies } from 'next/headers';
import { GET } from '@/app/api/auth/check/route';

const mockCookiesGet = jest.fn();

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('GET /api/auth/check', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (cookies as jest.Mock).mockResolvedValue({
      get: mockCookiesGet,
      set: jest.fn(),
    });
  });

  it('returns 200 with authenticated: true when cookie is set', async () => {
    mockCookiesGet.mockReturnValue({ value: 'authenticated' });

    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.authenticated).toBe(true);
    expect(mockCookiesGet).toHaveBeenCalledWith('authToken');
  });

  it('returns 401 with authenticated: false when cookie is missing', async () => {
    mockCookiesGet.mockReturnValue(undefined);

    const res = await GET();

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.authenticated).toBe(false);
  });

  it('returns 401 when cookie value is not "authenticated"', async () => {
    mockCookiesGet.mockReturnValue({ value: 'other' });

    const res = await GET();

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.authenticated).toBe(false);
  });
});

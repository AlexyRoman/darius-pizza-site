/** @jest-environment node */

import { cookies } from 'next/headers';
import { isAuthenticated } from '@/lib/auth';

const mockCookiesGet = jest.fn();

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

describe('auth.isAuthenticated', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (cookies as jest.Mock).mockResolvedValue({
      get: mockCookiesGet,
      set: jest.fn(),
    });
  });

  it('returns true when authToken cookie value is "authenticated"', async () => {
    mockCookiesGet.mockReturnValue({ value: 'authenticated' });

    const result = await isAuthenticated();

    expect(result).toBe(true);
    expect(mockCookiesGet).toHaveBeenCalledWith('authToken');
  });

  it('returns false when cookie is missing', async () => {
    mockCookiesGet.mockReturnValue(undefined);

    const result = await isAuthenticated();

    expect(result).toBe(false);
  });

  it('returns false when cookie value is not "authenticated"', async () => {
    mockCookiesGet.mockReturnValue({ value: 'other' });

    const result = await isAuthenticated();

    expect(result).toBe(false);
  });

  it('returns false when cookies() rejects', async () => {
    (cookies as jest.Mock).mockRejectedValueOnce(new Error('cookie error'));

    const result = await isAuthenticated();

    expect(result).toBe(false);
  });
});

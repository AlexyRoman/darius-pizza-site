/** @jest-environment node */

import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

describe('auth-constants', () => {
  it('exports AUTH_COOKIE_NAME as a non-empty string', () => {
    expect(typeof AUTH_COOKIE_NAME).toBe('string');
    expect(AUTH_COOKIE_NAME.length).toBeGreaterThan(0);
  });

  it('AUTH_COOKIE_NAME is stable for cookie lookup', () => {
    expect(AUTH_COOKIE_NAME).toBe('authToken');
  });
});

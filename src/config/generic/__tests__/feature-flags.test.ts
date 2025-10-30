/**
 * Tests for feature flags
 *
 * These tests verify feature flag utilities work correctly.
 */

// Mock the env module BEFORE importing
jest.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_ENABLE_ITEM_CTA: 'true',
  },
  parseBooleanEnv: jest.fn((value, defaultValue) => {
    if (value === undefined) return defaultValue;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return Boolean(value);
  }),
}));

import { isItemCtaEnabled } from '../feature-flags';

describe('feature-flags', () => {
  describe('isItemCtaEnabled', () => {
    it('should return boolean value', () => {
      const result = isItemCtaEnabled();
      expect(typeof result).toBe('boolean');
    });

    it('should call parseBooleanEnv with correct parameters', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { parseBooleanEnv, env } = require('@/lib/env');

      isItemCtaEnabled();
      expect(parseBooleanEnv).toHaveBeenCalledWith(
        env.NEXT_PUBLIC_ENABLE_ITEM_CTA,
        true
      );
    });
  });
});

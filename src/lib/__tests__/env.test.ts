/**
 * Tests for environment variable validation and parsing
 */

/* eslint-disable @typescript-eslint/no-require-imports */
// require() is necessary here to re-import modules after changing process.env

describe('env', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('envPublic', () => {
    it('should validate public env vars with valid URLs', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
      process.env.NEXT_PUBLIC_CURRENCY = '€';

      const { envPublic } = require('../env');
      expect(envPublic.NEXT_PUBLIC_API_URL).toBe('https://api.example.com');
      expect(envPublic.NEXT_PUBLIC_SITE_URL).toBe('https://example.com');
      expect(envPublic.NEXT_PUBLIC_CURRENCY).toBe('€');
    });

    it('should accept empty strings for optional URLs', () => {
      process.env.NEXT_PUBLIC_API_URL = '';
      process.env.NEXT_PUBLIC_SITE_URL = '';

      const { envPublic } = require('../env');
      expect(envPublic.NEXT_PUBLIC_API_URL).toBe('');
      expect(envPublic.NEXT_PUBLIC_SITE_URL).toBe('');
    });

    it('should accept undefined for optional fields', () => {
      delete process.env.NEXT_PUBLIC_API_URL;
      delete process.env.NEXT_PUBLIC_APP_NAME;

      const { envPublic } = require('../env');
      expect(envPublic.NEXT_PUBLIC_API_URL).toBeUndefined();
      expect(envPublic.NEXT_PUBLIC_APP_NAME).toBeUndefined();
    });

    it('should validate currency enum', () => {
      process.env.NEXT_PUBLIC_CURRENCY = '$';
      const { envPublic } = require('../env');
      expect(envPublic.NEXT_PUBLIC_CURRENCY).toBe('$');

      process.env.NEXT_PUBLIC_CURRENCY = '€';
      jest.resetModules();
      const { envPublic: envPublic2 } = require('../env');
      expect(envPublic2.NEXT_PUBLIC_CURRENCY).toBe('€');
    });

    it('should reject invalid currency values', () => {
      process.env.NEXT_PUBLIC_CURRENCY = 'INVALID';
      expect(() => require('../env')).toThrow();
    });

    it('should reject invalid URLs', () => {
      process.env.NEXT_PUBLIC_API_URL = 'not-a-url';
      expect(() => require('../env')).toThrow();
    });
  });

  describe('envServer', () => {
    it('should validate server env vars', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (process.env as any).NODE_ENV = 'production';
      process.env.SITE_TIME_ZONE = 'America/New_York';
      process.env.SITE_PHONE = '+1234567890';

      const { envServer } = require('../env');
      expect(envServer.NODE_ENV).toBe('production');
      expect(envServer.SITE_TIME_ZONE).toBe('America/New_York');
      expect(envServer.SITE_PHONE).toBe('+1234567890');
    });

    it('should use default values for NODE_ENV when not set', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (process.env as any).NODE_ENV;
      const { envServer } = require('../env');
      expect(envServer.NODE_ENV).toBe('development');
    });

    it('should use default values for SITE_TIME_ZONE', () => {
      delete process.env.SITE_TIME_ZONE;
      const { envServer } = require('../env');
      expect(envServer.SITE_TIME_ZONE).toBe('Europe/Paris');
    });

    it('should use default values for SITE_PHONE', () => {
      delete process.env.SITE_PHONE;
      const { envServer } = require('../env');
      expect(envServer.SITE_PHONE).toBe('+33494640511');
    });

    it('should validate NODE_ENV enum', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (process.env as any).NODE_ENV = 'test';
      const { envServer } = require('../env');
      expect(envServer.NODE_ENV).toBe('test');
    });

    it('should reject invalid NODE_ENV values', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (process.env as any).NODE_ENV = 'invalid';
      expect(() => require('../env')).toThrow();
    });

    it('should validate email format for RESEND_FROM_EMAIL', () => {
      process.env.RESEND_FROM_EMAIL = 'test@example.com';
      const { envServer } = require('../env');
      expect(envServer.RESEND_FROM_EMAIL).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      process.env.RESEND_FROM_EMAIL = 'not-an-email';
      expect(() => require('../env')).toThrow();
    });

    it('should accept empty strings for optional URLs', () => {
      process.env.SUPABASE_URL = '';
      process.env.UPSTASH_REDIS_REST_URL = '';
      const { envServer } = require('../env');
      expect(envServer.SUPABASE_URL).toBe('');
      expect(envServer.UPSTASH_REDIS_REST_URL).toBe('');
    });
  });

  describe('env', () => {
    it('should merge public and server env vars', () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (process.env as any).NODE_ENV = 'production';
      process.env.SITE_TIME_ZONE = 'Europe/Paris';

      const { env } = require('../env');
      expect(env.NEXT_PUBLIC_API_URL).toBe('https://api.example.com');
      expect(env.NODE_ENV).toBe('production');
      expect(env.SITE_TIME_ZONE).toBe('Europe/Paris');
    });
  });

  describe('parseBooleanEnv', () => {
    it('should parse boolean env values correctly', () => {
      const { parseBooleanEnv } = require('../env');

      expect(parseBooleanEnv('true', false)).toBe(true);
      expect(parseBooleanEnv('TRUE', false)).toBe(true);
      expect(parseBooleanEnv('1', false)).toBe(true);
      expect(parseBooleanEnv('yes', false)).toBe(true);
      expect(parseBooleanEnv('YES', false)).toBe(true);
      expect(parseBooleanEnv('on', false)).toBe(true);
      expect(parseBooleanEnv('ON', false)).toBe(true);

      expect(parseBooleanEnv('false', true)).toBe(false);
      expect(parseBooleanEnv('0', true)).toBe(false);
      expect(parseBooleanEnv('no', true)).toBe(false);
      expect(parseBooleanEnv('off', true)).toBe(false);
      expect(parseBooleanEnv('random', true)).toBe(false);
    });

    it('should return default value when undefined', () => {
      const { parseBooleanEnv } = require('../env');
      expect(parseBooleanEnv(undefined, true)).toBe(true);
      expect(parseBooleanEnv(undefined, false)).toBe(false);
    });

    it('should handle whitespace', () => {
      const { parseBooleanEnv } = require('../env');
      expect(parseBooleanEnv(' true ', false)).toBe(true);
      expect(parseBooleanEnv('  1  ', false)).toBe(true);
      expect(parseBooleanEnv('  false  ', true)).toBe(false);
    });
  });
});

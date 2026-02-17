/**
 * Tests for hours-storage abstraction (Upstash + file + static fallback).
 */

import type { HoursConfig } from '@/types/restaurant-config';

jest.mock('node:fs/promises', () => {
  return {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
  };
});

jest.mock('@upstash/redis', () => {
  return {
    Redis: jest.fn(),
  };
});

const mockReadFile = jest.requireMock('node:fs/promises')
  .readFile as jest.MockedFunction<
  (path: string, encoding: string) => Promise<string>
>;
const mockWriteFile = jest.requireMock('node:fs/promises')
  .writeFile as jest.MockedFunction<
  (path: string, data: string, encoding: string) => Promise<void>
>;
const mockMkdir = jest.requireMock('node:fs/promises')
  .mkdir as jest.MockedFunction<
  (path: string, opts: { recursive: boolean }) => Promise<void>
>;

const MockRedis = jest.requireMock('@upstash/redis').Redis as jest.MockedClass<
  new (opts: { url: string; token: string }) => {
    get: jest.Mock;
    set: jest.Mock;
  }
>;

const originalEnv = process.env;

describe('hours-storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    // Default: Upstash disabled unless explicitly enabled in a test
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function makeConfig(overrides: Partial<HoursConfig> = {}): HoursConfig {
    return {
      openingHours: {
        monday: {
          day: 'monday',
          isOpen: true,
          periods: [{ open: '10:00', close: '22:00' }],
        },
        tuesday: {
          day: 'tuesday',
          isOpen: true,
          periods: [{ open: '10:00', close: '22:00' }],
        },
        wednesday: {
          day: 'wednesday',
          isOpen: true,
          periods: [{ open: '10:00', close: '22:00' }],
        },
        thursday: {
          day: 'thursday',
          isOpen: true,
          periods: [{ open: '10:00', close: '22:00' }],
        },
        friday: {
          day: 'friday',
          isOpen: true,
          periods: [{ open: '10:00', close: '23:00' }],
        },
        saturday: {
          day: 'saturday',
          isOpen: true,
          periods: [{ open: '10:00', close: '23:00' }],
        },
        sunday: {
          day: 'sunday',
          isOpen: false,
          periods: [],
        },
      },
      timezone: 'Europe/Paris',
      lastUpdated: '2024-01-01T00:00:00.000Z',
      ...overrides,
    };
  }

  describe('getHoursConfig', () => {
    it('returns data from Upstash when configured', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      const redisGet = jest
        .fn<Promise<HoursConfig | null>, [string]>()
        .mockResolvedValue(
          makeConfig({ lastUpdated: '2024-02-01T00:00:00.000Z' })
        );
      MockRedis.mockImplementation(
        () =>
          ({
            get: redisGet,
            set: jest.fn(),
          }) as unknown as { get: jest.Mock; set: jest.Mock }
      );

      const { getHoursConfig } = await import('../hours-storage');
      const result = await getHoursConfig();

      expect(MockRedis).toHaveBeenCalledTimes(1);
      expect(redisGet).toHaveBeenCalledWith('opening_hours');
      expect(result.lastUpdated).toBe('2024-02-01T00:00:00.000Z');
    });

    it('falls back to file when Upstash is not configured or returns null', async () => {
      // Upstash disabled
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      const fromFile = makeConfig({ lastUpdated: '2024-03-01T00:00:00.000Z' });
      mockReadFile.mockResolvedValueOnce(JSON.stringify(fromFile));

      const { getHoursConfig } = await import('../hours-storage');
      const result = await getHoursConfig();

      expect(MockRedis).not.toHaveBeenCalled();
      expect(mockReadFile).toHaveBeenCalledTimes(1);
      expect(result.lastUpdated).toBe('2024-03-01T00:00:00.000Z');
    });

    it('falls back to static hours when both Upstash and file storage are empty', async () => {
      // Upstash disabled and file read fails
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
      mockReadFile.mockRejectedValueOnce(new Error('no file'));

      const { getHoursConfig } = await import('../hours-storage');
      const result = await getHoursConfig();

      // We don't assert exact static content, only that it has the expected shape
      expect(result).toHaveProperty('openingHours');
      expect(result).toHaveProperty('lastUpdated');
    });
  });

  describe('saveHoursConfig', () => {
    it('saves to Upstash when configured and returns ok true', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      const redisSet = jest
        .fn<Promise<void>, [string, HoursConfig]>()
        .mockResolvedValue();
      MockRedis.mockImplementation(
        () =>
          ({
            get: jest.fn(),
            set: redisSet,
          }) as unknown as { get: jest.Mock; set: jest.Mock }
      );

      const { saveHoursConfig } = await import('../hours-storage');
      const config = makeConfig();
      const result = await saveHoursConfig(config);

      expect(redisSet).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
      // When Redis is configured and succeeds, file should not be written
      expect(mockWriteFile).not.toHaveBeenCalled();
    });

    it('falls back to file when Upstash is configured but saving to Redis fails', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      const redisSet = jest
        .fn<Promise<void>, [string, HoursConfig]>()
        .mockRejectedValue(new Error('redis down'));
      MockRedis.mockImplementation(
        () =>
          ({
            get: jest.fn(),
            set: redisSet,
          }) as unknown as { get: jest.Mock; set: jest.Mock }
      );

      mockMkdir.mockResolvedValue();
      mockWriteFile.mockResolvedValue();

      const { saveHoursConfig } = await import('../hours-storage');
      const config = makeConfig();
      const result = await saveHoursConfig(config);

      expect(redisSet).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });

    it('saves only to file when Upstash is not configured', async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      mockMkdir.mockResolvedValue();
      mockWriteFile.mockResolvedValue();

      const { saveHoursConfig } = await import('../hours-storage');
      const config = makeConfig();
      const result = await saveHoursConfig(config);

      expect(MockRedis).not.toHaveBeenCalled();
      expect(mockMkdir).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });

    it('returns error when both Upstash and file backends fail', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      const redisSet = jest
        .fn<Promise<void>, [string, HoursConfig]>()
        .mockRejectedValue(new Error('redis down'));
      MockRedis.mockImplementation(
        () =>
          ({
            get: jest.fn(),
            set: redisSet,
          }) as unknown as { get: jest.Mock; set: jest.Mock }
      );

      mockMkdir.mockRejectedValue(new Error('fs error'));

      const { saveHoursConfig } = await import('../hours-storage');
      const config = makeConfig();
      const result = await saveHoursConfig(config);

      expect(redisSet).toHaveBeenCalledTimes(1);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/Could not save/i);
      }
    });
  });
});

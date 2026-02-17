/**
 * Tests for messages-storage abstraction (Upstash + file + restaurant-config fallback).
 */

import type { MessagesConfig } from '@/types/restaurant-config';

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

jest.mock('../restaurant-config', () => {
  return {
    loadRestaurantConfig: jest.fn(),
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

const { loadRestaurantConfig } = jest.requireMock('../restaurant-config') as {
  loadRestaurantConfig: jest.MockedFunction<
    (type: 'messages', locale: string) => Promise<MessagesConfig>
  >;
};

const originalEnv = process.env;

describe('messages-storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function makeConfig(overrides: Partial<MessagesConfig> = {}): MessagesConfig {
    return {
      specialMessages: [
        {
          id: 'message-1',
          type: 'info',
          title: 'Message 1',
          message: 'Hello',
          isActive: true,
          startDate: '2024-01-01T00:00:00Z',
          endDate: null,
          priority: 1,
        },
      ],
      lastUpdated: '2024-01-01T00:00:00.000Z',
      ...overrides,
    };
  }

  describe('getMessagesConfig', () => {
    it('returns data from Upstash when configured', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      const redisGet = jest
        .fn<Promise<MessagesConfig | null>, [string]>()
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

      const { getMessagesConfig } = await import('../messages-storage');
      const result = await getMessagesConfig('en');

      expect(MockRedis).toHaveBeenCalledTimes(1);
      expect(redisGet).toHaveBeenCalledWith('messages_en');
      expect(result.lastUpdated).toBe('2024-02-01T00:00:00.000Z');
    });

    it('falls back to file when Upstash is not configured or returns null', async () => {
      const config = makeConfig({ lastUpdated: '2024-03-01T00:00:00.000Z' });
      const fileData = { en: config };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(fileData));

      const { getMessagesConfig } = await import('../messages-storage');
      const result = await getMessagesConfig('en');

      expect(MockRedis).not.toHaveBeenCalled();
      expect(mockReadFile).toHaveBeenCalledTimes(1);
      expect(result.lastUpdated).toBe('2024-03-01T00:00:00.000Z');
    });

    it('falls back to loadRestaurantConfig when both Upstash and file are empty', async () => {
      mockReadFile.mockRejectedValueOnce(new Error('no file'));

      const fallback = makeConfig({ lastUpdated: '2024-04-01T00:00:00.000Z' });
      loadRestaurantConfig.mockResolvedValueOnce(fallback);

      const { getMessagesConfig } = await import('../messages-storage');
      const result = await getMessagesConfig('en');

      expect(loadRestaurantConfig).toHaveBeenCalledWith('messages', 'en');
      expect(result.lastUpdated).toBe('2024-04-01T00:00:00.000Z');
    });
  });

  describe('saveMessagesConfig', () => {
    it('saves to Upstash when configured and returns ok true', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      const redisSet = jest
        .fn<Promise<void>, [string, MessagesConfig]>()
        .mockResolvedValue();
      MockRedis.mockImplementation(
        () =>
          ({
            get: jest.fn(),
            set: redisSet,
          }) as unknown as { get: jest.Mock; set: jest.Mock }
      );

      const { saveMessagesConfig } = await import('../messages-storage');
      const config = makeConfig();
      const result = await saveMessagesConfig('en', config);

      expect(redisSet).toHaveBeenCalledTimes(1);
      expect(redisSet.mock.calls[0][0]).toBe('messages_en');
      expect(result).toEqual({ ok: true });
      expect(mockWriteFile).not.toHaveBeenCalled();
    });

    it('falls back to file when Upstash is configured but saving to Redis fails', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      const redisSet = jest
        .fn<Promise<void>, [string, MessagesConfig]>()
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

      const { saveMessagesConfig } = await import('../messages-storage');
      const config = makeConfig();
      const result = await saveMessagesConfig('en', config);

      expect(redisSet).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });

    it('saves only to file when Upstash is not configured', async () => {
      mockMkdir.mockResolvedValue();
      mockWriteFile.mockResolvedValue();

      const { saveMessagesConfig } = await import('../messages-storage');
      const config = makeConfig();
      const result = await saveMessagesConfig('en', config);

      expect(MockRedis).not.toHaveBeenCalled();
      expect(mockMkdir).toHaveBeenCalledTimes(1);
      expect(mockWriteFile).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ ok: true });
    });

    it('returns error when both Upstash and file backends fail', async () => {
      process.env.UPSTASH_REDIS_REST_URL = 'https://example.com';
      process.env.UPSTASH_REDIS_REST_TOKEN = 'token';

      const redisSet = jest
        .fn<Promise<void>, [string, MessagesConfig]>()
        .mockRejectedValue(new Error('redis down'));
      MockRedis.mockImplementation(
        () =>
          ({
            get: jest.fn(),
            set: redisSet,
          }) as unknown as { get: jest.Mock; set: jest.Mock }
      );

      mockMkdir.mockRejectedValue(new Error('fs error'));

      const { saveMessagesConfig } = await import('../messages-storage');
      const config = makeConfig();
      const result = await saveMessagesConfig('en', config);

      expect(redisSet).toHaveBeenCalledTimes(1);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toMatch(/Could not save/i);
      }
    });
  });
});

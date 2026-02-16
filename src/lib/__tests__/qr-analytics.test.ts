/** @jest-environment node */

const mockIncr = jest.fn();
const mockKeys = jest.fn();
const mockMget = jest.fn();

jest.mock('@upstash/redis', () => ({
  Redis: class MockRedis {
    incr = mockIncr;
    keys = mockKeys;
    mget = mockMget;
  },
}));

import { recordQrHit, getQrCounts } from '@/lib/qr-analytics';

describe('qr-analytics', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = { ...originalEnv };
    process.env.UPSTASH_REDIS_REST_URL = 'https://test.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('recordQrHit', () => {
    it('increments the correct key for valid code', async () => {
      mockIncr.mockResolvedValue(1);

      await recordQrHit('DEMO');

      expect(mockIncr).toHaveBeenCalledWith('qr:count:DEMO');
    });

    it('does not call Redis for invalid code (wrong length)', async () => {
      await recordQrHit('AB');
      await recordQrHit('ABCDE');

      expect(mockIncr).not.toHaveBeenCalled();
    });

    it('does not call Redis for invalid code (invalid chars)', async () => {
      await recordQrHit('DEM-');
      await recordQrHit('DE M');

      expect(mockIncr).not.toHaveBeenCalled();
    });

    it('accepts 4 alphanumeric code', async () => {
      mockIncr.mockResolvedValue(1);

      await recordQrHit('BT26');
      await recordQrHit('ab12');

      expect(mockIncr).toHaveBeenCalledWith('qr:count:BT26');
      expect(mockIncr).toHaveBeenCalledWith('qr:count:ab12');
    });

    it('returns early when Upstash not configured', async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;

      await recordQrHit('DEMO');

      expect(mockIncr).not.toHaveBeenCalled();
    });
  });

  describe('getQrCounts', () => {
    it('returns array of { code, count } sorted by count descending', async () => {
      mockKeys.mockResolvedValue(['qr:count:DEMO', 'qr:count:BT26']);
      mockMget.mockResolvedValue([5, 10]);

      const result = await getQrCounts();

      expect(mockKeys).toHaveBeenCalledWith('qr:count:*');
      expect(mockMget).toHaveBeenCalledWith('qr:count:DEMO', 'qr:count:BT26');
      expect(result).toEqual([
        { code: 'BT26', count: 10 },
        { code: 'DEMO', count: 5 },
      ]);
    });

    it('returns empty array when no keys', async () => {
      mockKeys.mockResolvedValue([]);

      const result = await getQrCounts();

      expect(result).toEqual([]);
      expect(mockMget).not.toHaveBeenCalled();
    });

    it('returns empty array when Upstash not configured', async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;

      const result = await getQrCounts();

      expect(result).toEqual([]);
      expect(mockKeys).not.toHaveBeenCalled();
    });

    it('handles null/undefined count values', async () => {
      mockKeys.mockResolvedValue(['qr:count:DEMO']);
      mockMget.mockResolvedValue([null]);

      const result = await getQrCounts();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ code: 'DEMO' });
      expect(typeof result[0]?.count).toBe('number');
    });
  });
});

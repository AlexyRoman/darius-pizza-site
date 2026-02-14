/**
 * Unit tests for qr-analytics (code-tag recording and counts).
 * Mocks Upstash Redis so we don't need a real Redis in CI.
 */

const mockSadd = jest.fn().mockResolvedValue(1);
const mockIncr = jest.fn().mockResolvedValue(1);
const mockSmembers = jest.fn().mockResolvedValue([]);
const mockGet = jest.fn().mockResolvedValue(0);

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({
    sadd: mockSadd,
    incr: mockIncr,
    smembers: mockSmembers,
    get: mockGet,
  })),
}));

// Must import after mock so module uses mocked Redis
import { isValidQrCode, recordQrHit, getQrCounts } from '../qr-analytics';

describe('qr-analytics', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      UPSTASH_REDIS_REST_URL: 'https://test.upstash.io',
      UPSTASH_REDIS_REST_TOKEN: 'test-token',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('isValidQrCode', () => {
    it('accepts exactly 4 alphanumeric characters', () => {
      expect(isValidQrCode('DEMO')).toBe(true);
      expect(isValidQrCode('BT26')).toBe(true);
      expect(isValidQrCode('ab12')).toBe(true);
      expect(isValidQrCode('Z9z9')).toBe(true);
    });

    it('rejects wrong length', () => {
      expect(isValidQrCode('')).toBe(false);
      expect(isValidQrCode('AB')).toBe(false);
      expect(isValidQrCode('ABCDE')).toBe(false);
    });

    it('rejects non-alphanumeric', () => {
      expect(isValidQrCode('AB-1')).toBe(false);
      expect(isValidQrCode('AB C')).toBe(false);
      expect(isValidQrCode('AB.1')).toBe(false);
    });
  });

  describe('recordQrHit', () => {
    it('does nothing when code is invalid', async () => {
      await recordQrHit('TOOLONG');
      await recordQrHit('');
      expect(mockSadd).not.toHaveBeenCalled();
      expect(mockIncr).not.toHaveBeenCalled();
    });

    it('calls Redis sadd and incr when Upstash is configured and code valid', async () => {
      await recordQrHit('DEMO');

      expect(mockSadd).toHaveBeenCalledWith('qr:codes', 'DEMO');
      expect(mockIncr).toHaveBeenCalledWith('qr:count:DEMO');
    });

    it('does nothing when Upstash is not configured', async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      await recordQrHit('DEMO');

      expect(mockSadd).not.toHaveBeenCalled();
      expect(mockIncr).not.toHaveBeenCalled();
    });
  });

  describe('getQrCounts', () => {
    it('returns empty array when Upstash is not configured', async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      const result = await getQrCounts();

      expect(result).toEqual([]);
      expect(mockSmembers).not.toHaveBeenCalled();
    });

    it('returns codes and counts from Redis, sorted by count descending', async () => {
      mockSmembers.mockResolvedValue(['DEMO', 'BT26']);
      mockGet.mockResolvedValueOnce(10).mockResolvedValueOnce(25);

      const result = await getQrCounts();

      expect(mockSmembers).toHaveBeenCalledWith('qr:codes');
      expect(mockGet).toHaveBeenCalledWith('qr:count:DEMO');
      expect(mockGet).toHaveBeenCalledWith('qr:count:BT26');
      expect(result).toEqual([
        { code: 'BT26', count: 25 },
        { code: 'DEMO', count: 10 },
      ]);
    });

    it('returns empty array when no codes in set', async () => {
      mockSmembers.mockResolvedValue([]);

      const result = await getQrCounts();

      expect(result).toEqual([]);
      expect(mockGet).not.toHaveBeenCalled();
    });
  });
});

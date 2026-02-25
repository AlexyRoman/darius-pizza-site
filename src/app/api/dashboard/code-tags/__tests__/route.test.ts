/** @jest-environment node */

import { GET } from '@/app/api/dashboard/code-tags/route';

const mockIsAuthenticated = jest.fn();
const mockGetQrCounts = jest.fn();

jest.mock('@/lib/auth', () => ({
  isAuthenticated: () => mockIsAuthenticated(),
}));

jest.mock('@/lib/qr-analytics', () => ({
  getQrCounts: () => mockGetQrCounts(),
}));

describe('GET /api/dashboard/code-tags', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    mockIsAuthenticated.mockResolvedValue(false);

    const res = await GET();

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
    expect(mockGetQrCounts).not.toHaveBeenCalled();
  });

  it('returns 200 with codes when authenticated', async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockGetQrCounts.mockResolvedValue([
      { code: 'DEMO', count: 5 },
      { code: 'QR02', count: 3 },
    ]);

    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      codes: [
        { code: 'DEMO', count: 5 },
        { code: 'QR02', count: 3 },
      ],
    });
    expect(mockGetQrCounts).toHaveBeenCalled();
  });

  it('returns empty codes array when no data', async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockGetQrCounts.mockResolvedValue([]);

    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ codes: [] });
  });
});

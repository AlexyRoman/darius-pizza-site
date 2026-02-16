/** @jest-environment node */

import { NextRequest } from 'next/server';
import { GET, PUT } from '@/app/api/closings/route';

const mockGetClosingsConfig = jest.fn();
const mockSaveClosingsConfig = jest.fn();
const mockIsAuthenticated = jest.fn();

jest.mock('@/lib/auth', () => ({
  isAuthenticated: () => mockIsAuthenticated(),
}));

jest.mock('@/lib/closings-storage', () => ({
  getClosingsConfig: (...args: unknown[]) => mockGetClosingsConfig(...args),
  saveClosingsConfig: (...args: unknown[]) => mockSaveClosingsConfig(...args),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('GET /api/closings', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 with config for valid locale', async () => {
    const config = {
      scheduledClosings: [],
      emergencyClosings: [],
      lastUpdated: new Date().toISOString(),
    };
    mockGetClosingsConfig.mockResolvedValue(config);

    const req = new NextRequest('http://localhost/api/closings?locale=en');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(config);
    expect(mockGetClosingsConfig).toHaveBeenCalledWith('en');
  });

  it('defaults locale to en when missing', async () => {
    mockGetClosingsConfig.mockResolvedValue({
      scheduledClosings: [],
      emergencyClosings: [],
    });

    const req = new NextRequest('http://localhost/api/closings');
    await GET(req);

    expect(mockGetClosingsConfig).toHaveBeenCalledWith('en');
  });

  it('returns 500 when getClosingsConfig throws', async () => {
    mockGetClosingsConfig.mockRejectedValue(new Error('storage error'));

    const req = new NextRequest('http://localhost/api/closings');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Failed to load closings');
  });
});

describe('PUT /api/closings', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    mockIsAuthenticated.mockResolvedValue(false);

    const body = {
      locale: 'en',
      scheduledClosings: [] as unknown[],
      emergencyClosings: [] as unknown[],
    };
    const req = new NextRequest('http://localhost/api/closings', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const res = await PUT(req);

    expect(res.status).toBe(401);
    expect(mockSaveClosingsConfig).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid body (missing arrays)', async () => {
    mockIsAuthenticated.mockResolvedValue(true);

    const req = new NextRequest('http://localhost/api/closings', {
      method: 'PUT',
      body: JSON.stringify({ locale: 'en' }),
    });
    const res = await PUT(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid closings format');
  });

  it('returns 200 and saves when authenticated with valid body', async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockSaveClosingsConfig.mockResolvedValue({ ok: true });

    const body = {
      locale: 'en',
      scheduledClosings: [],
      emergencyClosings: [],
    };
    const req = new NextRequest('http://localhost/api/closings', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const res = await PUT(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mockSaveClosingsConfig).toHaveBeenCalledWith(
      'en',
      expect.objectContaining({
        scheduledClosings: [],
        emergencyClosings: [],
      })
    );
  });

  it('returns 503 when save fails', async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockSaveClosingsConfig.mockResolvedValue({
      ok: false,
      error: 'Redis unavailable',
    });

    const body = {
      locale: 'en',
      scheduledClosings: [],
      emergencyClosings: [],
    };
    const req = new NextRequest('http://localhost/api/closings', {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    const res = await PUT(req);

    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('Redis unavailable');
  });
});

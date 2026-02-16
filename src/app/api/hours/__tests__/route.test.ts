/** @jest-environment node */

import { NextRequest } from 'next/server';
import { GET, PUT } from '@/app/api/hours/route';

const validHoursConfig = {
  openingHours: {
    monday: { day: 'monday', isOpen: false, periods: [] },
    tuesday: {
      day: 'tuesday',
      isOpen: true,
      periods: [{ open: '18:00', close: '21:30' }],
    },
    wednesday: {
      day: 'wednesday',
      isOpen: true,
      periods: [{ open: '18:00', close: '21:30' }],
    },
    thursday: {
      day: 'thursday',
      isOpen: true,
      periods: [{ open: '18:00', close: '21:30' }],
    },
    friday: {
      day: 'friday',
      isOpen: true,
      periods: [{ open: '18:00', close: '21:30' }],
    },
    saturday: {
      day: 'saturday',
      isOpen: true,
      periods: [{ open: '18:00', close: '21:30' }],
    },
    sunday: {
      day: 'sunday',
      isOpen: true,
      periods: [{ open: '18:00', close: '21:30' }],
    },
  },
  timezone: 'Europe/Paris',
  lastUpdated: new Date().toISOString(),
};

const mockGetHoursConfig = jest.fn();
const mockSaveHoursConfig = jest.fn();
const mockIsAuthenticated = jest.fn();

jest.mock('@/lib/auth', () => ({
  isAuthenticated: () => mockIsAuthenticated(),
}));

jest.mock('@/lib/hours-storage', () => ({
  getHoursConfig: () => mockGetHoursConfig(),
  saveHoursConfig: (config: unknown) => mockSaveHoursConfig(config),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('GET /api/hours', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 with config', async () => {
    mockGetHoursConfig.mockResolvedValue(validHoursConfig);

    const res = await GET();

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(validHoursConfig);
    expect(mockGetHoursConfig).toHaveBeenCalled();
  });

  it('returns 500 when getHoursConfig throws', async () => {
    mockGetHoursConfig.mockRejectedValue(new Error('storage error'));

    const res = await GET();

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Failed to load opening hours');
  });
});

describe('PUT /api/hours', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    mockIsAuthenticated.mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/hours', {
      method: 'PUT',
      body: JSON.stringify(validHoursConfig),
    });
    const res = await PUT(req);

    expect(res.status).toBe(401);
    expect(mockSaveHoursConfig).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid body (missing openingHours)', async () => {
    mockIsAuthenticated.mockResolvedValue(true);

    const req = new NextRequest('http://localhost/api/hours', {
      method: 'PUT',
      body: JSON.stringify({}),
    });
    const res = await PUT(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid opening hours format');
  });

  it('returns 200 and saves when authenticated with valid body', async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockSaveHoursConfig.mockResolvedValue({ ok: true });
    mockGetHoursConfig.mockResolvedValue(validHoursConfig);

    const req = new NextRequest('http://localhost/api/hours', {
      method: 'PUT',
      body: JSON.stringify(validHoursConfig),
    });
    const res = await PUT(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.config).toEqual(validHoursConfig);
    expect(mockSaveHoursConfig).toHaveBeenCalledWith(
      expect.objectContaining({ openingHours: validHoursConfig.openingHours })
    );
  });

  it('returns 503 when save fails', async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockSaveHoursConfig.mockResolvedValue({
      ok: false,
      error: 'Redis unavailable',
    });

    const req = new NextRequest('http://localhost/api/hours', {
      method: 'PUT',
      body: JSON.stringify(validHoursConfig),
    });
    const res = await PUT(req);

    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('Redis unavailable');
  });
});

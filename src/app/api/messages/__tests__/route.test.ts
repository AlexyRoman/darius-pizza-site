/** @jest-environment node */

import { NextRequest } from 'next/server';
import { GET, PUT } from '@/app/api/messages/route';

const mockGetMessagesConfig = jest.fn();
const mockSaveMessagesConfig = jest.fn();
const mockIsAuthenticated = jest.fn();

jest.mock('@/lib/auth', () => ({
  isAuthenticated: () => mockIsAuthenticated(),
}));

jest.mock('@/lib/messages-storage', () => ({
  getMessagesConfig: (...args: unknown[]) => mockGetMessagesConfig(...args),
  saveMessagesConfig: (...args: unknown[]) => mockSaveMessagesConfig(...args),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('GET /api/messages', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 with config for valid locale', async () => {
    const config = {
      specialMessages: [],
      lastUpdated: new Date().toISOString(),
    };
    mockGetMessagesConfig.mockResolvedValue(config);

    const req = new NextRequest('http://localhost/api/messages?locale=en');
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(config);
    expect(mockGetMessagesConfig).toHaveBeenCalledWith('en');
  });

  it('defaults locale to en when missing', async () => {
    mockGetMessagesConfig.mockResolvedValue({ specialMessages: [] });

    const req = new NextRequest('http://localhost/api/messages');
    await GET(req);

    expect(mockGetMessagesConfig).toHaveBeenCalledWith('en');
  });

  it('sanitizes invalid locale to en', async () => {
    mockGetMessagesConfig.mockResolvedValue({ specialMessages: [] });

    const req = new NextRequest('http://localhost/api/messages?locale=xx');
    await GET(req);

    expect(mockGetMessagesConfig).toHaveBeenCalledWith('en');
  });

  it('accepts fr locale', async () => {
    mockGetMessagesConfig.mockResolvedValue({ specialMessages: [] });

    const req = new NextRequest('http://localhost/api/messages?locale=fr');
    await GET(req);

    expect(mockGetMessagesConfig).toHaveBeenCalledWith('fr');
  });

  it('returns 500 when getMessagesConfig throws', async () => {
    mockGetMessagesConfig.mockRejectedValue(new Error('storage error'));

    const req = new NextRequest('http://localhost/api/messages');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe('Failed to load messages');
  });
});

describe('PUT /api/messages', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 401 when unauthenticated', async () => {
    mockIsAuthenticated.mockResolvedValue(false);

    const req = new NextRequest('http://localhost/api/messages', {
      method: 'PUT',
      body: JSON.stringify({ locale: 'en', specialMessages: [] }),
    });
    const res = await PUT(req);

    expect(res.status).toBe(401);
    expect(mockSaveMessagesConfig).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid body (missing specialMessages)', async () => {
    mockIsAuthenticated.mockResolvedValue(true);

    const req = new NextRequest('http://localhost/api/messages', {
      method: 'PUT',
      body: JSON.stringify({ locale: 'en' }),
    });
    const res = await PUT(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Invalid messages format');
  });

  it('returns 200 and saves when authenticated with valid body', async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockSaveMessagesConfig.mockResolvedValue({ ok: true });

    const req = new NextRequest('http://localhost/api/messages', {
      method: 'PUT',
      body: JSON.stringify({ locale: 'en', specialMessages: [] }),
    });
    const res = await PUT(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mockSaveMessagesConfig).toHaveBeenCalledWith(
      'en',
      expect.objectContaining({ specialMessages: [] })
    );
  });

  it('returns 503 when save fails', async () => {
    mockIsAuthenticated.mockResolvedValue(true);
    mockSaveMessagesConfig.mockResolvedValue({
      ok: false,
      error: 'Redis unavailable',
    });

    const req = new NextRequest('http://localhost/api/messages', {
      method: 'PUT',
      body: JSON.stringify({ locale: 'en', specialMessages: [] }),
    });
    const res = await PUT(req);

    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.error).toBe('Redis unavailable');
  });
});

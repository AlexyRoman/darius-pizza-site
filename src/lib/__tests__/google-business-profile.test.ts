/**
 * Unit tests for Google Business Profile sync module.
 * Mappers (pure functions) and async sync with mocked fetch/env.
 */

import type { ClosingsConfig, HoursConfig } from '@/types/restaurant-config';
import {
  hoursConfigToGBPRegularHours,
  closingsConfigToGBPSpecialHours,
  refreshAccessToken,
  syncRegularHours,
  syncSpecialHours,
} from '../google-business-profile';

const originalEnv = process.env;

function makeHoursConfig(overrides: Partial<HoursConfig> = {}): HoursConfig {
  const closedDay = {
    day: 'monday',
    isOpen: false,
    periods: [] as Array<{ open: string; close: string }>,
  };
  const openDay = (day: string, open = '18:00', close = '21:30') => ({
    day,
    isOpen: true,
    periods: [{ open, close }],
  });
  return {
    openingHours: {
      monday: closedDay,
      tuesday: openDay('tuesday'),
      wednesday: openDay('wednesday'),
      thursday: openDay('thursday'),
      friday: openDay('friday'),
      saturday: openDay('saturday'),
      sunday: closedDay,
    },
    timezone: 'Europe/Paris',
    lastUpdated: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeClosingsConfig(
  overrides: Partial<ClosingsConfig> = {}
): ClosingsConfig {
  return {
    scheduledClosings: [],
    emergencyClosings: [],
    lastUpdated: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('hoursConfigToGBPRegularHours', () => {
  it('returns empty periods when all days are closed', () => {
    const config = makeHoursConfig({
      openingHours: {
        monday: { day: 'monday', isOpen: false, periods: [] },
        tuesday: { day: 'tuesday', isOpen: false, periods: [] },
        wednesday: { day: 'wednesday', isOpen: false, periods: [] },
        thursday: { day: 'thursday', isOpen: false, periods: [] },
        friday: { day: 'friday', isOpen: false, periods: [] },
        saturday: { day: 'saturday', isOpen: false, periods: [] },
        sunday: { day: 'sunday', isOpen: false, periods: [] },
      },
    });
    const result = hoursConfigToGBPRegularHours(config);
    expect(result.periods).toHaveLength(0);
  });

  it('maps one open day to one period with correct day and time format', () => {
    const config = makeHoursConfig({
      openingHours: {
        ...makeHoursConfig().openingHours,
        monday: { day: 'monday', isOpen: false, periods: [] },
        tuesday: {
          day: 'tuesday',
          isOpen: true,
          periods: [{ open: '18:00', close: '21:30' }],
        },
        wednesday: { day: 'wednesday', isOpen: false, periods: [] },
        thursday: { day: 'thursday', isOpen: false, periods: [] },
        friday: { day: 'friday', isOpen: false, periods: [] },
        saturday: { day: 'saturday', isOpen: false, periods: [] },
        sunday: { day: 'sunday', isOpen: false, periods: [] },
      },
    });
    const result = hoursConfigToGBPRegularHours(config);
    expect(result.periods).toHaveLength(1);
    expect(result.periods[0]).toEqual({
      openDay: 'TUESDAY',
      closeDay: 'TUESDAY',
      openTime: { hours: 18, minutes: 0, seconds: 0, nanos: 0 },
      closeTime: { hours: 21, minutes: 30, seconds: 0, nanos: 0 },
    });
  });

  it('omits closed days and includes only open days', () => {
    const config = makeHoursConfig({
      openingHours: {
        monday: { day: 'monday', isOpen: false, periods: [] },
        tuesday: {
          day: 'tuesday',
          isOpen: true,
          periods: [{ open: '10:00', close: '14:00' }],
        },
        wednesday: { day: 'wednesday', isOpen: false, periods: [] },
        thursday: {
          day: 'thursday',
          isOpen: true,
          periods: [{ open: '18:00', close: '22:00' }],
        },
        friday: { day: 'friday', isOpen: false, periods: [] },
        saturday: { day: 'saturday', isOpen: false, periods: [] },
        sunday: { day: 'sunday', isOpen: false, periods: [] },
      },
    });
    const result = hoursConfigToGBPRegularHours(config);
    expect(result.periods).toHaveLength(2);
    expect(result.periods[0].openDay).toBe('TUESDAY');
    expect(result.periods[0].openTime).toEqual({
      hours: 10,
      minutes: 0,
      seconds: 0,
      nanos: 0,
    });
    expect(result.periods[1].openDay).toBe('THURSDAY');
    expect(result.periods[1].closeTime).toEqual({
      hours: 22,
      minutes: 0,
      seconds: 0,
      nanos: 0,
    });
  });

  it('outputs multiple periods for one day when day has multiple intervals', () => {
    const config = makeHoursConfig({
      openingHours: {
        ...makeHoursConfig().openingHours,
        wednesday: {
          day: 'wednesday',
          isOpen: true,
          periods: [
            { open: '09:00', close: '12:00' },
            { open: '14:00', close: '18:00' },
          ],
        },
      },
    });
    const result = hoursConfigToGBPRegularHours(config);
    const wednesdayPeriods = result.periods.filter(
      p => p.openDay === 'WEDNESDAY'
    );
    expect(wednesdayPeriods).toHaveLength(2);
    expect(wednesdayPeriods[0].openTime).toEqual({
      hours: 9,
      minutes: 0,
      seconds: 0,
      nanos: 0,
    });
    expect(wednesdayPeriods[0].closeTime).toEqual({
      hours: 12,
      minutes: 0,
      seconds: 0,
      nanos: 0,
    });
    expect(wednesdayPeriods[1].openTime).toEqual({
      hours: 14,
      minutes: 0,
      seconds: 0,
      nanos: 0,
    });
  });
});

describe('closingsConfigToGBPSpecialHours', () => {
  it('returns empty specialHourPeriods when no scheduled closings', () => {
    const config = makeClosingsConfig();
    const result = closingsConfigToGBPSpecialHours(config);
    expect(result.specialHourPeriods).toHaveLength(0);
  });

  it('ignores inactive scheduled closings', () => {
    const config = makeClosingsConfig({
      scheduledClosings: [
        {
          id: 'x',
          title: 'X',
          description: '',
          date: null,
          startDate: '2024-12-25T00:00:00.000Z',
          endDate: '2024-12-25T23:59:59.999Z',
          isRecurring: false,
          isActive: false,
        },
      ],
    });
    const result = closingsConfigToGBPSpecialHours(config);
    expect(result.specialHourPeriods).toHaveLength(0);
  });

  it('maps one single-day active closing to one period with closed true', () => {
    const config = makeClosingsConfig({
      scheduledClosings: [
        {
          id: 'xmas',
          title: 'Christmas',
          description: '',
          date: null,
          startDate: '2024-12-25T12:00:00.000Z',
          endDate: '2024-12-25T12:00:00.000Z',
          isRecurring: false,
          isActive: true,
        },
      ],
    });
    const result = closingsConfigToGBPSpecialHours(config);
    expect(result.specialHourPeriods).toHaveLength(1);
    expect(result.specialHourPeriods[0]).toEqual({
      startDate: { year: 2024, month: 12, day: 25 },
      closed: true,
    });
  });

  it('caps a closing longer than 5 days at 5 special hour periods', () => {
    const config = makeClosingsConfig({
      scheduledClosings: [
        {
          id: 'vacation',
          title: 'Vacation',
          description: '',
          date: null,
          startDate: '2024-08-01T00:00:00.000Z',
          endDate: '2024-08-10T23:59:59.999Z',
          isRecurring: false,
          isActive: true,
        },
      ],
    });
    const result = closingsConfigToGBPSpecialHours(config);
    expect(result.specialHourPeriods).toHaveLength(5);
    expect(result.specialHourPeriods[0].startDate).toEqual({
      year: 2024,
      month: 8,
      day: 1,
    });
    expect(result.specialHourPeriods[4].startDate).toEqual({
      year: 2024,
      month: 8,
      day: 5,
    });
    result.specialHourPeriods.forEach(p => {
      expect(p.closed).toBe(true);
    });
  });

  it('produces one period per day for a 3-day closing', () => {
    const config = makeClosingsConfig({
      scheduledClosings: [
        {
          id: 'break',
          title: 'Break',
          description: '',
          date: null,
          startDate: '2024-07-14T00:00:00.000Z',
          endDate: '2024-07-16T00:00:00.000Z',
          isRecurring: false,
          isActive: true,
        },
      ],
    });
    const result = closingsConfigToGBPSpecialHours(config);
    expect(result.specialHourPeriods).toHaveLength(3);
    expect(result.specialHourPeriods.map(p => p.startDate.day)).toEqual([
      14, 15, 16,
    ]);
  });
});

describe('refreshAccessToken', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_REFRESH_TOKEN;
    delete process.env.GOOGLE_LOCATION_NAME;
    delete process.env.GOOGLE_SYNC_ENABLED;
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns null when Google sync is not configured', async () => {
    const token = await refreshAccessToken();
    expect(token).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns access token when configured and token endpoint returns 200', async () => {
    process.env.GOOGLE_SYNC_ENABLED = 'true';
    process.env.GOOGLE_CLIENT_ID = 'client-id';
    process.env.GOOGLE_CLIENT_SECRET = 'secret';
    process.env.GOOGLE_REFRESH_TOKEN = 'refresh-token';
    process.env.GOOGLE_LOCATION_NAME = 'locations/123';

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'new-access-token' }),
    });

    const token = await refreshAccessToken();
    expect(token).toBe('new-access-token');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://oauth2.googleapis.com/token',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );
    const body = mockFetch.mock.calls[0][1].body as string;
    expect(body).toContain('grant_type=refresh_token');
    expect(body).toContain('refresh_token=refresh-token');
    expect(body).toContain('client_id=client-id');
    expect(body).toContain('client_secret=secret');
  });

  it('returns null when token endpoint returns 400', async () => {
    process.env.GOOGLE_SYNC_ENABLED = 'true';
    process.env.GOOGLE_CLIENT_ID = 'c';
    process.env.GOOGLE_CLIENT_SECRET = 's';
    process.env.GOOGLE_REFRESH_TOKEN = 'r';
    process.env.GOOGLE_LOCATION_NAME = 'locations/1';

    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
      json: async () => ({ error: 'invalid_grant' }),
    });

    const token = await refreshAccessToken();
    expect(token).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    process.env.GOOGLE_SYNC_ENABLED = 'true';
    process.env.GOOGLE_CLIENT_ID = 'c';
    process.env.GOOGLE_CLIENT_SECRET = 's';
    process.env.GOOGLE_REFRESH_TOKEN = 'r';
    process.env.GOOGLE_LOCATION_NAME = 'locations/1';

    mockFetch.mockRejectedValueOnce(new Error('network error'));

    const token = await refreshAccessToken();
    expect(token).toBeNull();
  });
});

describe('syncRegularHours', () => {
  const mockFetch = jest.fn();
  const hoursConfig = makeHoursConfig();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_REFRESH_TOKEN;
    delete process.env.GOOGLE_LOCATION_NAME;
    delete process.env.GOOGLE_SYNC_ENABLED;
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns ok true and skipped when not configured', async () => {
    const result = await syncRegularHours(hoursConfig);
    expect(result).toEqual({ ok: true, skipped: true });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns ok false when configured but token refresh fails', async () => {
    process.env.GOOGLE_SYNC_ENABLED = 'true';
    process.env.GOOGLE_CLIENT_ID = 'c';
    process.env.GOOGLE_CLIENT_SECRET = 's';
    process.env.GOOGLE_REFRESH_TOKEN = 'r';
    process.env.GOOGLE_LOCATION_NAME = 'locations/99';

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'invalid_grant' }),
    });

    const result = await syncRegularHours(hoursConfig);
    expect(result).toEqual({ ok: false, error: 'token_refresh_failed' });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('calls PATCH with correct URL, body and updateMask when configured and token succeeds', async () => {
    process.env.GOOGLE_SYNC_ENABLED = 'true';
    process.env.GOOGLE_CLIENT_ID = 'c';
    process.env.GOOGLE_CLIENT_SECRET = 's';
    process.env.GOOGLE_REFRESH_TOKEN = 'r';
    process.env.GOOGLE_LOCATION_NAME = 'locations/42';

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'token' }),
      })
      .mockResolvedValueOnce({ ok: true });

    const result = await syncRegularHours(hoursConfig);
    expect(result).toEqual({ ok: true });
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const patchCall = mockFetch.mock.calls[1];
    expect(patchCall[0]).toBe(
      'https://mybusinessbusinessinformation.googleapis.com/v1/locations/42?updateMask=regularHours'
    );
    expect(patchCall[1]).toMatchObject({
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
      },
    });
    const body = JSON.parse(patchCall[1].body as string);
    expect(body).toHaveProperty('regularHours');
    expect(body.regularHours).toHaveProperty('periods');
    expect(Array.isArray(body.regularHours.periods)).toBe(true);
  });

  it('returns ok false with error message when PATCH returns non-ok', async () => {
    process.env.GOOGLE_SYNC_ENABLED = 'true';
    process.env.GOOGLE_CLIENT_ID = 'c';
    process.env.GOOGLE_CLIENT_SECRET = 's';
    process.env.GOOGLE_REFRESH_TOKEN = 'r';
    process.env.GOOGLE_LOCATION_NAME = 'locations/1';

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 't' }),
      })
      .mockResolvedValueOnce({
        ok: false,
        statusText: 'Forbidden',
        text: async () =>
          JSON.stringify({ error: { message: 'Permission denied' } }),
      });

    const result = await syncRegularHours(hoursConfig);
    expect(result).toEqual({ ok: false, error: 'Permission denied' });
  });
});

describe('syncSpecialHours', () => {
  const mockFetch = jest.fn();
  const closingsConfig = makeClosingsConfig({
    scheduledClosings: [
      {
        id: 'x',
        title: 'X',
        description: '',
        date: null,
        startDate: '2024-12-25T12:00:00.000Z',
        endDate: '2024-12-25T12:00:00.000Z',
        isRecurring: false,
        isActive: true,
      },
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GOOGLE_REFRESH_TOKEN;
    delete process.env.GOOGLE_LOCATION_NAME;
    delete process.env.GOOGLE_SYNC_ENABLED;
    global.fetch = mockFetch as unknown as typeof fetch;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns ok true and skipped when not configured', async () => {
    const result = await syncSpecialHours(closingsConfig);
    expect(result).toEqual({ ok: true, skipped: true });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('calls PATCH with updateMask=specialHours when configured', async () => {
    process.env.GOOGLE_SYNC_ENABLED = 'true';
    process.env.GOOGLE_CLIENT_ID = 'c';
    process.env.GOOGLE_CLIENT_SECRET = 's';
    process.env.GOOGLE_REFRESH_TOKEN = 'r';
    process.env.GOOGLE_LOCATION_NAME = 'locations/88';

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 't' }),
      })
      .mockResolvedValueOnce({ ok: true });

    const result = await syncSpecialHours(closingsConfig, 'fr');
    expect(result).toEqual({ ok: true });
    const patchCall = mockFetch.mock.calls[1];
    expect(patchCall[0]).toBe(
      'https://mybusinessbusinessinformation.googleapis.com/v1/locations/88?updateMask=specialHours'
    );
    const body = JSON.parse(patchCall[1].body as string);
    expect(body).toHaveProperty('specialHours');
    expect(body.specialHours).toHaveProperty('specialHourPeriods');
    expect(body.specialHours.specialHourPeriods.length).toBeGreaterThanOrEqual(
      1
    );
    expect(body.specialHours.specialHourPeriods[0].closed).toBe(true);
    expect(body.specialHours.specialHourPeriods[0].startDate).toEqual({
      year: 2024,
      month: 12,
      day: 25,
    });
  });
});

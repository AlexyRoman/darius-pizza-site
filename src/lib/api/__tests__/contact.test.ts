import { submitContactForm } from '@/lib/api/contact';

const baseValues = {
  name: 'Jane Roe',
  email: 'jane@example.com',
  phone: '123',
  subject: 'Subject here',
  inquiryType: 'general',
  message: 'A reasonably long message to pass validation.',
  preferredContact: 'email' as const,
  turnstileToken: 'ts-token',
};

describe('submitContactForm', () => {
  beforeEach(() => {
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns ok=true on 200 response', async () => {
    const fetchMock = global.fetch as unknown as jest.Mock;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const result = await submitContactForm(baseValues);
    expect(result).toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('returns ok=false with server error message', async () => {
    const fetchMock = global.fetch as unknown as jest.Mock;
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Rate limited' }),
    });

    const result = await submitContactForm(baseValues);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Rate limited');
  });

  it('returns default error on non-JSON error body', async () => {
    const fetchMock = global.fetch as unknown as jest.Mock;
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error('parse error');
      },
    });

    const result = await submitContactForm(baseValues);
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Failed to send message');
  });
});

/** @jest-environment node */
import type { NextRequest } from 'next/server';

// Default: mock Resend with a no-op send that resolves
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn().mockResolvedValue({ data: { id: 'ok' } }) },
  })),
}));

// Mock env module to control server-side configuration per test
jest.mock('@/lib/env', () => ({
  envServer: {
    RESEND_API_KEY: 'test-resend-api-key',
    RESEND_FROM_EMAIL: 'no-reply@test.com',
    RESEND_TO_EMAIL: 'owner@test.com',
    TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
  },
}));

describe('POST /api/contact', () => {
  const validBody = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    subject: 'Catering request',
    inquiryType: 'catering',
    message: 'Hello, I would like to book catering service. Thanks!',
    preferredContact: 'email',
    turnstileToken: 'valid-token',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 and sends emails on success', async () => {
    // Mock Turnstile verification success
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true }),
      ok: true,
    } as unknown as Response);

    const { POST } = await import('@/app/api/contact/route');
    const request = { json: async () => validBody } as unknown as NextRequest;
    const response = await POST(request);

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
  });

  it('returns 400 on validation error', async () => {
    const badBody = { ...validBody, email: 'not-an-email' };
    const { POST } = await import('@/app/api/contact/route');
    const request = { json: async () => badBody } as unknown as NextRequest;
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 403 when Turnstile verification fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: false }),
      ok: true,
    } as unknown as Response);

    const { POST } = await import('@/app/api/contact/route');
    const request = { json: async () => validBody } as unknown as NextRequest;
    const response = await POST(request);
    expect(response.status).toBe(403);
  });

  it('returns 500 when email service not configured', async () => {
    // Override env mock for this test to simulate missing API key and skip Turnstile
    jest.resetModules();
    jest.doMock('@/lib/env', () => ({
      envServer: {
        RESEND_API_KEY: '',
        RESEND_FROM_EMAIL: 'no-reply@test.com',
        RESEND_TO_EMAIL: 'owner@test.com',
        TURNSTILE_SECRET_KEY: '',
      },
    }));

    // Re-import route to pick up new mock
    const { POST: POSTWithMissingEnv } = await import(
      '@/app/api/contact/route'
    );

    const request = { json: async () => validBody } as unknown as NextRequest;
    const response = await POSTWithMissingEnv(request);
    expect(response.status).toBe(500);
  });

  it('returns 500 when email sending fails', async () => {
    // Skip Turnstile to reach send logic quicker
    jest.resetModules();
    jest.doMock('@/lib/env', () => ({
      envServer: {
        RESEND_API_KEY: 'test-resend-api-key',
        RESEND_FROM_EMAIL: 'no-reply@test.com',
        RESEND_TO_EMAIL: 'owner@test.com',
        TURNSTILE_SECRET_KEY: '',
      },
    }));
    // First send returns error
    jest.doMock('resend', () => ({
      Resend: jest.fn().mockImplementation(() => ({
        emails: { send: jest.fn().mockResolvedValue({ error: 'fail' }) },
      })),
    }));

    const { POST } = await import('@/app/api/contact/route');
    const request = { json: async () => validBody } as unknown as NextRequest;
    const response = await POST(request);
    expect(response.status).toBe(500);
  });

  it('returns 500 when email addresses not configured', async () => {
    // Skip Turnstile
    jest.resetModules();
    jest.doMock('@/lib/env', () => ({
      envServer: {
        RESEND_API_KEY: 'test-resend-api-key',
        RESEND_FROM_EMAIL: '',
        RESEND_TO_EMAIL: '',
        TURNSTILE_SECRET_KEY: '',
      },
    }));
    const { POST } = await import('@/app/api/contact/route');
    const request = { json: async () => validBody } as unknown as NextRequest;
    const response = await POST(request);
    expect(response.status).toBe(500);
  });

  it('still returns 200 if auto-reply fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({ success: true }),
      ok: true,
    } as unknown as Response);

    // Mock Resend so that first send resolves and second rejects
    jest.resetModules();
    jest.doMock('@/lib/env', () => ({
      envServer: {
        RESEND_API_KEY: 'test-resend-api-key',
        RESEND_FROM_EMAIL: 'no-reply@test.com',
        RESEND_TO_EMAIL: 'owner@test.com',
        TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
      },
    }));
    jest.doMock('resend', () => ({
      Resend: jest.fn().mockImplementation(() => {
        const send = jest
          .fn()
          .mockResolvedValueOnce({ data: { id: 'email-1' } })
          .mockRejectedValueOnce(new Error('send failed'));
        return { emails: { send } };
      }),
    }));
    const { POST } = await import('@/app/api/contact/route');
    const request = { json: async () => validBody } as unknown as NextRequest;
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});

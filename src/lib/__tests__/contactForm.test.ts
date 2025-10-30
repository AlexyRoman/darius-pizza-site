import { contactFormSchema } from '@/lib/contactForm';

describe('contactFormSchema', () => {
  const valid = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123456789',
    subject: 'Catering inquiry',
    inquiryType: 'catering',
    message: 'We would like to book catering for 50 people.',
    preferredContact: 'email',
    turnstileToken: 'token-123',
  };

  it('accepts valid data', () => {
    const result = contactFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects too-short name', () => {
    const result = contactFormSchema.safeParse({ ...valid, name: 'J' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name?.[0]).toMatch(
        /at least 2 characters/i
      );
    }
  });

  it('rejects invalid email', () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toMatch(
        /valid email/i
      );
    }
  });

  it('requires inquiryType', () => {
    const result = contactFormSchema.safeParse({ ...valid, inquiryType: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.inquiryType?.[0]).toMatch(
        /select an inquiry type/i
      );
    }
  });

  it('requires message minimum length', () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      message: 'too short',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.message?.[0]).toMatch(
        /at least 10 characters/i
      );
    }
  });

  it('requires turnstile token', () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      turnstileToken: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.turnstileToken?.[0]).toMatch(
        /verification/i
      );
    }
  });
});

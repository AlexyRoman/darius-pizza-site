import type { ContactFormValues } from '@/lib/contactForm';

type SubmitResult = {
  ok: boolean;
  error?: string;
};

export async function submitContactForm(
  values: ContactFormValues
): Promise<SubmitResult> {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  let data: { error?: string } | null = null;
  try {
    data = await response.json();
  } catch {
    // ignore parse errors; handled below
  }

  if (!response.ok) {
    return {
      ok: false,
      error: (data && data.error) || 'Failed to send message',
    };
  }

  return { ok: true };
}

import { z } from 'zod';

// Shared contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().optional(),
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  inquiryType: z.string().min(1, {
    message: 'Please select an inquiry type.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
  preferredContact: z.string().optional(),
  turnstileToken: z.string().min(1, {
    message: 'Please complete the verification.',
  }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

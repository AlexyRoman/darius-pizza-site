import { z } from 'zod';

// Helper schema: allow valid URL or empty string/undefined (treat empty as unset)
const urlOptional = z.union([z.string().url(), z.literal('')]).optional();

// Public (client-exposed) env vars
const PublicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: urlOptional,
  NEXT_PUBLIC_SITE_URL: urlOptional,
  NEXT_PUBLIC_APP_NAME: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: urlOptional,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_CURRENCY: z.enum(['$', '€']).optional(),
  NEXT_PUBLIC_ENABLE_ITEM_CTA: z.string().optional(),
});

// Server-only env vars (never exposed to the client)
const ServerEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  SUPABASE_URL: urlOptional,
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: urlOptional,
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  // Resend email configuration
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  RESEND_TO_EMAIL: z.string().email().optional(),
  // Turnstile configuration
  TURNSTILE_SECRET_KEY: z.string().optional(),
  // Local site config defaults
  SITE_TIME_ZONE: z.string().default('Europe/Paris'),
  SITE_PHONE: z.string().default('+33123456789'),
});

// Capture raw
const rawPublic = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_CURRENCY: process.env.NEXT_PUBLIC_CURRENCY,
  NEXT_PUBLIC_ENABLE_ITEM_CTA: process.env.NEXT_PUBLIC_ENABLE_ITEM_CTA,
};
const rawServer = {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  RESEND_TO_EMAIL: process.env.RESEND_TO_EMAIL,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  SITE_TIME_ZONE: process.env.SITE_TIME_ZONE,
  SITE_PHONE: process.env.SITE_PHONE,
};

// Validate
export const envPublic = PublicEnvSchema.parse(rawPublic);
export const envServer = ServerEnvSchema.parse(rawServer);

// Unified accessor (read-only)
export const env = {
  ...envServer,
  ...envPublic,
} as const;

export function parseBooleanEnv(
  value: string | undefined,
  defaultValue: boolean
): boolean {
  if (value === undefined) return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  return (
    normalized === '1' ||
    normalized === 'true' ||
    normalized === 'yes' ||
    normalized === 'on'
  );
}

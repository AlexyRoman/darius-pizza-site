import { env } from '@/lib/env';

export function getSiteTimeZone(): string {
  return env.SITE_TIME_ZONE;
}

export function getSitePhone(): string {
  return env.SITE_PHONE;
}

export function formatCurrency(amount: number): string {
  const currency = env.NEXT_PUBLIC_CURRENCY ?? '€';
  const amountStr = amount.toFixed(2);
  if (currency === '$') {
    return `${currency}${amountStr}`;
  }
  return `${amountStr}${currency}`;
}

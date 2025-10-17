import { env, parseBooleanEnv } from '@/lib/env';

export function isItemCtaEnabled(): boolean {
  return parseBooleanEnv(env.NEXT_PUBLIC_ENABLE_ITEM_CTA, true);
}

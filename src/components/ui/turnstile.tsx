'use client';

import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { envPublic } from '@/lib/env';
import { useTheme } from 'next-themes';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const { resolvedTheme } = useTheme();

  if (!envPublic.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    return null;
  }

  // Determine if we should use dark theme
  // resolvedTheme is the actual theme (light/dark), accounting for system preference
  const isDarkTheme = resolvedTheme === 'dark';

  return (
    <Turnstile
      siteKey={envPublic.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
      onSuccess={onSuccess}
      onError={onError}
      options={{
        theme: isDarkTheme ? 'dark' : 'light',
        size: 'normal',
      }}
    />
  );
}

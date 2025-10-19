'use client';

import React from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import {
  ThemeToggleButton,
  useThemeTransition,
} from '@/components/ui/shadcn-io/theme-toggle-button';
import { withThrottle, withRateLimit } from '@/lib/pacer';

export function ThemeToggle() {
  const { theme, effectiveTheme, cycleTheme, isThemeLoaded } =
    useThemeContext();

  const { startTransition } = useThemeTransition();
  const onClick = React.useMemo(
    () =>
      withRateLimit(
        withThrottle(() => {
          startTransition(() => {
            cycleTheme();
          });
        }, 350)
      ),
    [startTransition, cycleTheme]
  );

  return (
    <ThemeToggleButton
      theme={effectiveTheme === 'dark' ? 'dark' : 'light'}
      themeMode={theme}
      variant='circle-blur'
      start='top-right'
      onClick={onClick}
      disabled={!isThemeLoaded}
      className='rounded-full overflow-hidden border-0 bg-transparent shadow-none'
    />
  );
}

export default ThemeToggle;

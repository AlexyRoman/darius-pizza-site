'use client';

import React from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import {
  ThemeToggleButton,
  useThemeTransition,
} from '@/components/ui/shadcn-io/theme-toggle-button';
import { withThrottle, withRateLimit } from '@/lib/pacer';

export function ThemeToggle() {
  const { theme, toggleTheme, isThemeLoaded } = useThemeContext();

  const { startTransition } = useThemeTransition();
  const onClick = React.useMemo(
    () =>
      withRateLimit(
        withThrottle(() => {
          startTransition(() => {
            toggleTheme();
          });
        }, 350)
      ),
    [startTransition, toggleTheme]
  );

  return (
    <ThemeToggleButton
      theme={theme === 'dark' ? 'dark' : 'light'}
      variant='circle-blur'
      start='top-right'
      onClick={onClick}
      disabled={!isThemeLoaded}
      className='border-0 bg-transparent hover:bg-transparent shadow-none'
    />
  );
}

export default ThemeToggle;

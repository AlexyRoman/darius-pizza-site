'use client';

import React from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { ThemeToggleButton } from '@/components/ui/shadcn-io/theme-toggle-button';
import { withThrottle, withRateLimit } from '@/lib/pacer';

export function ThemeToggle() {
  const { theme, effectiveTheme, cycleTheme, isThemeLoaded } =
    useThemeContext();

  const onClick = React.useMemo(
    () =>
      withRateLimit(
        withThrottle(() => {
          cycleTheme();
        }, 350)
      ),
    [cycleTheme]
  );

  return (
    <ThemeToggleButton
      theme={effectiveTheme === 'dark' ? 'dark' : 'light'}
      themeMode={theme}
      variant='circle-blur'
      start='top-right'
      onClick={onClick}
      disabled={!isThemeLoaded}
      className='rounded-full overflow-hidden border-0 bg-transparent shadow-none focus-visible:ring-primary/40'
    />
  );
}

export default ThemeToggle;

'use client';

import React from 'react';

import { useThemeContext } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, isThemeLoaded } = useThemeContext();

  return (
    <button
      type='button'
      aria-label='Toggle theme'
      onClick={toggleTheme}
      disabled={!isThemeLoaded}
      className='px-2 py-1 text-sm rounded border'
    >
      {theme === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}

export default ThemeToggle;



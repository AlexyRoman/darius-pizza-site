'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
  isThemeLoaded: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

function getInitialTheme(): ThemeMode {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(
        'darius-pizza-theme'
      ) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system')
        return saved;
    } catch {}
  }
  return 'system';
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  }
  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // Get the effective theme based on current theme mode
  const getEffectiveTheme = (themeMode: ThemeMode): 'light' | 'dark' => {
    if (themeMode === 'system') {
      return getSystemTheme();
    }
    return themeMode;
  };

  const effectiveTheme = getEffectiveTheme(theme);

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    setIsThemeLoaded(true);

    // Apply theme immediately to prevent flash
    const root = document.documentElement;
    const effectiveTheme = getEffectiveTheme(initial);
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--effective-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--effective-theme', 'light');
    }
  }, []);

  useEffect(() => {
    if (!isThemeLoaded) return;
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--effective-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--effective-theme', 'light');
    }
  }, [effectiveTheme, isThemeLoaded]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== 'system' || !isThemeLoaded) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = document.documentElement;
      if (getSystemTheme() === 'dark') {
        root.classList.add('dark');
        root.style.setProperty('--effective-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.style.setProperty('--effective-theme', 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, isThemeLoaded]);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
    try {
      localStorage.setItem('darius-pizza-theme', next);
    } catch {}
  };

  const cycleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, effectiveTheme, setTheme, cycleTheme, isThemeLoaded }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

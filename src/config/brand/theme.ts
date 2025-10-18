/**
 * Theme Configuration for Darius Pizza
 *
 * This file defines the complete theme system including light and dark modes,
 * theme switching logic, and theme-specific configurations. The theme system
 * is designed to work seamlessly with the brand colors and typography.
 */

import { brandColors, generateCSSVariables } from './colors';
import { generateTypographyCSSVariables } from './typography';
import { generateSpacingCSSVariables } from './spacing';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: typeof brandColors.light | typeof brandColors.dark;
  cssVariables: Record<string, string>;
}

export interface ThemeContext {
  currentTheme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isThemeLoaded: boolean;
}

// Theme configuration
export const themeConfig = {
  // Default theme
  default: 'light' as ThemeMode,

  // Theme storage key
  storageKey: 'darius-pizza-theme',

  // System theme detection
  systemThemeQuery: '(prefers-color-scheme: dark)',

  // Theme transition duration
  transitionDuration: '300ms',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Theme-specific configurations
  themes: {
    light: {
      name: 'Light',
      description: 'Clean and bright theme perfect for daytime browsing',
      icon: '☀️',
      colors: brandColors.light,
    },
    dark: {
      name: 'Dark',
      description: 'Easy on the eyes for evening browsing',
      icon: '🌙',
      colors: brandColors.dark,
    },
    system: {
      name: 'System',
      description: 'Follows your device theme preference',
      icon: '💻',
      colors: null, // Will be resolved based on system preference
    },
  },
};

// Generate CSS variables for each theme
export const generateThemeCSSVariables = (theme: 'light' | 'dark') => {
  return {
    ...generateCSSVariables(theme),
    ...generateTypographyCSSVariables(),
    ...generateSpacingCSSVariables(),

    // Theme-specific variables
    '--theme-transition-duration': themeConfig.transitionDuration,
    '--theme-transition-timing': themeConfig.transitionTimingFunction,
  };
};

// Theme detection utilities
export const detectSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  try {
    return window.matchMedia(themeConfig.systemThemeQuery).matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
};

export const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(themeConfig.storageKey);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // Ignore localStorage errors
  }

  return null;
};

export const storeTheme = (theme: ThemeMode): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(themeConfig.storageKey, theme);
  } catch {
    // Ignore localStorage errors
  }
};

// Resolve theme based on mode and system preference
export const resolveTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return detectSystemTheme();
  }
  return mode;
};

// Apply theme to document
export const applyTheme = (theme: 'light' | 'dark'): void => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const cssVariables = generateThemeCSSVariables(theme);

  // Apply CSS variables
  Object.entries(cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  // Apply theme class
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update meta theme-color for mobile browsers
  const metaThemeColors = document.querySelectorAll('meta[name="theme-color"]');
  metaThemeColors.forEach(meta => {
    const media = meta.getAttribute('media');
    if (!media) {
      // Default theme color (fallback)
      meta.setAttribute(
        'content',
        theme === 'dark' ? 'oklch(0.12 0.02 45)' : 'oklch(0.98 0.01 85)'
      );
    } else if (media === '(prefers-color-scheme: light)' && theme === 'light') {
      meta.setAttribute('content', 'oklch(0.98 0.01 85)');
    } else if (media === '(prefers-color-scheme: dark)' && theme === 'dark') {
      meta.setAttribute('content', 'oklch(0.12 0.02 45)');
    }
  });

  // Update Apple status bar style based on theme
  const appleStatusBarStyle = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]'
  );
  if (appleStatusBarStyle) {
    // For dark themes, use 'black-translucent' to make status bar content white
    // For light themes, use 'default' to make status bar content black
    appleStatusBarStyle.setAttribute(
      'content',
      theme === 'dark' ? 'black-translucent' : 'default'
    );
  }
};

// Theme initialization
export const initializeTheme = (): ThemeMode => {
  const storedTheme = getStoredTheme();
  const initialTheme = storedTheme || themeConfig.default;

  // Apply the resolved theme immediately
  const resolvedTheme = resolveTheme(initialTheme);
  applyTheme(resolvedTheme);

  return initialTheme;
};

// Theme change handler
export const handleThemeChange = (newTheme: ThemeMode): void => {
  const resolvedTheme = resolveTheme(newTheme);
  applyTheme(resolvedTheme);
  storeTheme(newTheme);
};

// System theme change listener
export const createSystemThemeListener = (
  callback: (theme: 'light' | 'dark') => void
) => {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia(themeConfig.systemThemeQuery);

  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handleChange);

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
};

// Theme utilities for components
export const getThemeColors = (theme: 'light' | 'dark') => {
  return brandColors[theme];
};

export const getThemeCSSVariables = (theme: 'light' | 'dark') => {
  return generateThemeCSSVariables(theme);
};

// Theme-aware color utilities
export const createThemeAwareColor = (
  lightColor: string,
  darkColor: string
) => {
  return `oklch(var(--color-${lightColor}), var(--color-${darkColor}))`;
};

// Animation utilities for theme transitions
export const themeTransitionStyles = {
  transition: `all ${themeConfig.transitionDuration} ${themeConfig.transitionTimingFunction}`,
  transitionProperty: 'background-color, border-color, color, fill, stroke',
};

// Export theme configuration for external use
export const getThemeConfig = () => themeConfig;
export const getThemeInfo = (theme: ThemeMode) => themeConfig.themes[theme];

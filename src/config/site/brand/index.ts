/**
 * Brand Identity Configuration Index
 *
 * This file serves as the main entry point for all brand identity configurations.
 * It exports all the brand-related configurations and provides utility functions
 * for easy access to brand elements throughout the application.
 */

// Export all brand configurations
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './theme';
export * from './fonts';

// Re-export commonly used types from centralized types file
export type {
  // Theme types
  ThemeMode,
  ThemeConfig,
  ThemeContext,
  // Color types
  ColorPalette,
  SemanticColors,
  ThemeColors,
  // Typography types
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  TypographyStyle,
  // Spacing types
  SpacingScale,
  Breakpoints,
  LayoutDimensions,
} from '@/types/brand';

// Import configurations for re-export
import {
  brandColors,
  generateCSSVariables,
  getColor,
  getColorVariation,
} from './colors';
import {
  fontFamilies,
  fontSizes,
  fontWeights,
  typographyScale,
  generateTypographyCSSVariables,
  getTypographyStyle,
} from './typography';
import {
  spacing,
  breakpoints,
  layoutDimensions,
  generateSpacingCSSVariables,
  getSpacing,
  getBreakpoint,
} from './spacing';
import {
  themeConfig,
  generateThemeCSSVariables,
  initializeTheme,
  handleThemeChange,
  getThemeColors,
} from './theme';

// Brand identity object for easy access
export const brandIdentity = {
  colors: brandColors,
  typography: {
    families: fontFamilies,
    sizes: fontSizes,
    weights: fontWeights,
    scale: typographyScale,
  },
  spacing: {
    scale: spacing,
    breakpoints,
    layout: layoutDimensions,
  },
  theme: themeConfig,
};

// Utility functions for easy access
export const brandUtils = {
  // Color utilities
  getColor,
  getColorVariation,
  generateColorVariables: generateCSSVariables,

  // Typography utilities
  getTypographyStyle,
  generateTypographyVariables: generateTypographyCSSVariables,

  // Spacing utilities
  getSpacing,
  getBreakpoint,
  generateSpacingVariables: generateSpacingCSSVariables,

  // Theme utilities
  initializeTheme,
  handleThemeChange,
  getThemeColors,
  generateThemeVariables: generateThemeCSSVariables,
};

// CSS variable generators for different themes
export const generateBrandCSSVariables = {
  light: () => generateThemeCSSVariables('light'),
  dark: () => generateThemeCSSVariables('dark'),
};

// Brand constants for easy reference
export const BRAND_CONSTANTS = {
  // Brand name
  BRAND_NAME: 'Darius Pizza',

  // Color palette names
  PRIMARY_COLOR: 'warm-orange-red',
  SECONDARY_COLOR: 'rich-brown',
  ACCENT_COLOR: 'golden-yellow',
  BACKGROUND_COLOR: 'cream-off-white',

  // Typography
  PRIMARY_FONT: 'Playfair Display',
  SECONDARY_FONT: 'Inter',
  MONO_FONT: 'JetBrains Mono',

  // Spacing
  BASE_SPACING_UNIT: '1rem', // 16px
  SPACING_SCALE_RATIO: 1.25,

  // Theme
  DEFAULT_THEME: 'light',
  THEME_STORAGE_KEY: 'darius-pizza-theme',
  THEME_TRANSITION_DURATION: '300ms',
} as const;

// Export default brand configuration
export default brandIdentity;

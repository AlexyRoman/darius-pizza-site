/**
 * Brand-related Type Definitions
 *
 * This file centralizes all type definitions related to brand identity,
 * including colors, typography, spacing, and theme configurations.
 * These types are used across the brand configuration system.
 */

// ============================================================================
// Color Types
// ============================================================================

/**
 * Core color palette for the brand
 */
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

/**
 * Semantic colors for UI states (error, warning, success, info)
 */
export interface SemanticColors {
  error: string;
  warning: string;
  success: string;
  info: string;
}

/**
 * Complete theme colors including palette and semantic colors
 */
export interface ThemeColors {
  light: ColorPalette & SemanticColors;
  dark: ColorPalette & SemanticColors;
}

// ============================================================================
// Typography Types
// ============================================================================

/**
 * Font family configuration
 */
export interface FontFamily {
  primary: string;
  secondary: string;
  mono: string;
}

/**
 * Font size scale
 */
export interface FontSize {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

/**
 * Font weight scale
 */
export interface FontWeight {
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
}

/**
 * Line height scale
 */
export interface LineHeight {
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
}

/**
 * Letter spacing scale
 */
export interface LetterSpacing {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

/**
 * Typography style configuration for a single element
 */
export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
}

// ============================================================================
// Spacing Types
// ============================================================================

/**
 * Spacing scale configuration
 */
export interface SpacingScale {
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

/**
 * Responsive breakpoints configuration
 */
export interface Breakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Layout dimensions configuration
 */
export interface LayoutDimensions {
  maxWidth: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    full: string;
  };
  containerPadding: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  sectionSpacing: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// ============================================================================
// Theme Types
// ============================================================================

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme configuration (used internally for theme state)
 * Note: The colors property references the actual brandColors values
 */
export interface ThemeConfig {
  mode: ThemeMode;
  colors: ColorPalette & SemanticColors;
  cssVariables: Record<string, string>;
}

/**
 * Theme context interface for React components
 */
export interface ThemeContext {
  currentTheme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isThemeLoaded: boolean;
}

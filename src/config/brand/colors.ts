/**
 * Brand Color Configuration for Darius Pizza
 *
 * This file defines the complete color palette for the pizzeria brand,
 * including primary, secondary, accent colors, and semantic colors for
 * different UI states. Colors are defined using OKLCH color space for
 * better perceptual uniformity and accessibility.
 */

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export interface SemanticColors {
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface ThemeColors {
  light: ColorPalette & SemanticColors;
  dark: ColorPalette & SemanticColors;
}

// Pizzeria-inspired color palette
// Primary: Warm orange-red (pizza sauce inspired)
// Secondary: Rich brown (crust inspired)
// Accent: Golden yellow (cheese inspired)
// Background: Cream/off-white (flour inspired)

export const brandColors: ThemeColors = {
  light: {
    // Primary colors - Warm orange-red (pizza sauce)
    primary: 'oklch(0.65 0.15 25)', // Warm orange-red
    secondary: 'oklch(0.45 0.08 45)', // Rich brown (crust)
    accent: 'oklch(0.75 0.12 85)', // Golden yellow (cheese)
    background: 'oklch(0.98 0.01 85)', // Cream/off-white
    foreground: 'oklch(0.15 0.02 45)', // Dark brown text

    // Semantic colors
    error: 'oklch(0.55 0.18 15)', // Deep red
    warning: 'oklch(0.70 0.15 65)', // Amber
    success: 'oklch(0.60 0.12 140)', // Forest green
    info: 'oklch(0.60 0.12 240)', // Deep blue
  },
  dark: {
    // Primary colors - Adjusted for dark theme
    primary: 'oklch(0.70 0.15 25)', // Brighter orange-red
    secondary: 'oklch(0.55 0.08 45)', // Lighter brown
    accent: 'oklch(0.80 0.12 85)', // Brighter golden yellow
    background: 'oklch(0.12 0.02 45)', // Very dark brown
    foreground: 'oklch(0.90 0.02 85)', // Light cream text

    // Semantic colors - Adjusted for dark theme
    error: 'oklch(0.65 0.18 15)', // Brighter red
    warning: 'oklch(0.75 0.15 65)', // Brighter amber
    success: 'oklch(0.65 0.12 140)', // Brighter green
    info: 'oklch(0.65 0.12 240)', // Brighter blue
  },
};

// Additional color variations for different UI states
export const colorVariations = {
  light: {
    // Primary variations
    primaryHover: 'oklch(0.60 0.15 25)',
    primaryActive: 'oklch(0.55 0.15 25)',
    primaryDisabled: 'oklch(0.75 0.05 25)',

    // Secondary variations
    secondaryHover: 'oklch(0.40 0.08 45)',
    secondaryActive: 'oklch(0.35 0.08 45)',
    secondaryDisabled: 'oklch(0.65 0.03 45)',

    // Background variations
    backgroundSecondary: 'oklch(0.95 0.01 85)',
    backgroundTertiary: 'oklch(0.92 0.01 85)',
    backgroundElevated: 'oklch(1.0 0.0 0)',

    // Border and divider colors
    border: 'oklch(0.88 0.02 45)',
    borderHover: 'oklch(0.82 0.02 45)',
    divider: 'oklch(0.90 0.01 45)',

    // Text variations
    textPrimary: 'oklch(0.15 0.02 45)',
    textSecondary: 'oklch(0.45 0.02 45)',
    textTertiary: 'oklch(0.65 0.02 45)',
    textDisabled: 'oklch(0.75 0.01 45)',
  },
  dark: {
    // Primary variations
    primaryHover: 'oklch(0.75 0.15 25)',
    primaryActive: 'oklch(0.80 0.15 25)',
    primaryDisabled: 'oklch(0.50 0.05 25)',

    // Secondary variations
    secondaryHover: 'oklch(0.60 0.08 45)',
    secondaryActive: 'oklch(0.65 0.08 45)',
    secondaryDisabled: 'oklch(0.40 0.03 45)',

    // Background variations
    backgroundSecondary: 'oklch(0.15 0.02 45)',
    backgroundTertiary: 'oklch(0.18 0.02 45)',
    backgroundElevated: 'oklch(0.20 0.02 45)',

    // Border and divider colors
    border: 'oklch(0.25 0.02 45)',
    borderHover: 'oklch(0.30 0.02 45)',
    divider: 'oklch(0.22 0.01 45)',

    // Text variations
    textPrimary: 'oklch(0.90 0.02 85)',
    textSecondary: 'oklch(0.70 0.02 85)',
    textTertiary: 'oklch(0.55 0.02 85)',
    textDisabled: 'oklch(0.45 0.01 85)',
  },
};

// CSS custom properties for easy theme switching
export const generateCSSVariables = (theme: 'light' | 'dark') => {
  const colors = brandColors[theme];
  const variations = colorVariations[theme];

  return {
    // Core brand colors
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background': colors.background,
    '--color-foreground': colors.foreground,

    // Semantic colors
    '--color-error': colors.error,
    '--color-warning': colors.warning,
    '--color-success': colors.success,
    '--color-info': colors.info,

    // Primary variations
    '--color-primary-hover': variations.primaryHover,
    '--color-primary-active': variations.primaryActive,
    '--color-primary-disabled': variations.primaryDisabled,

    // Secondary variations
    '--color-secondary-hover': variations.secondaryHover,
    '--color-secondary-active': variations.secondaryActive,
    '--color-secondary-disabled': variations.secondaryDisabled,

    // Background variations
    '--color-background-secondary': variations.backgroundSecondary,
    '--color-background-tertiary': variations.backgroundTertiary,
    '--color-background-elevated': variations.backgroundElevated,

    // Border colors
    '--color-border': variations.border,
    '--color-border-hover': variations.borderHover,
    '--color-divider': variations.divider,

    // Text colors
    '--color-text-primary': variations.textPrimary,
    '--color-text-secondary': variations.textSecondary,
    '--color-text-tertiary': variations.textTertiary,
    '--color-text-disabled': variations.textDisabled,
  };
};

// Utility function to get color by name
export const getColor = (
  colorName: keyof ColorPalette | keyof SemanticColors,
  theme: 'light' | 'dark' = 'light'
) => {
  return brandColors[theme][colorName];
};

// Utility function to get color variation
export const getColorVariation = (
  variationName: string,
  theme: 'light' | 'dark' = 'light'
) => {
  return colorVariations[theme][
    variationName as keyof typeof colorVariations.light
  ];
};

/**
 * Spacing and Layout Configuration for Darius Pizza
 *
 * This file defines the spacing system, layout dimensions, and responsive
 * breakpoints for the pizzeria website. The spacing system follows a
 * consistent scale for better visual harmony and design consistency.
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

export interface Breakpoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

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

// Spacing scale - Based on 8px grid system (0.5rem increments)
export const spacing: SpacingScale = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  base: '1rem', // 16px
  md: '1.5rem', // 24px
  lg: '2rem', // 32px
  xl: '3rem', // 48px
  '2xl': '4rem', // 64px
  '3xl': '6rem', // 96px
  '4xl': '8rem', // 128px
  '5xl': '12rem', // 192px
  '6xl': '16rem', // 256px
};

// Responsive breakpoints
export const breakpoints: Breakpoints = {
  xs: '320px', // Small phones
  sm: '640px', // Large phones / small tablets
  md: '768px', // Tablets
  lg: '1024px', // Small laptops
  xl: '1280px', // Large laptops / desktops
  '2xl': '1536px', // Large desktops
};

// Layout dimensions
export const layoutDimensions: LayoutDimensions = {
  maxWidth: {
    xs: '20rem', // 320px
    sm: '24rem', // 384px
    md: '28rem', // 448px
    lg: '32rem', // 512px
    xl: '36rem', // 576px
    '2xl': '42rem', // 672px
    full: '100%',
  },
  containerPadding: {
    mobile: spacing.base, // 16px
    tablet: spacing.lg, // 32px
    desktop: spacing.xl, // 48px
  },
  sectionSpacing: {
    mobile: spacing.xl, // 48px
    tablet: spacing['2xl'], // 64px
    desktop: spacing['3xl'], // 96px
  },
};

// Component-specific spacing
export const componentSpacing = {
  // Button spacing
  button: {
    paddingX: spacing.md, // 24px
    paddingY: spacing.sm, // 8px
    gap: spacing.xs, // 4px
  },
  buttonSmall: {
    paddingX: spacing.base, // 16px
    paddingY: spacing.xs, // 4px
    gap: spacing.xs, // 4px
  },
  buttonLarge: {
    paddingX: spacing.lg, // 32px
    paddingY: spacing.base, // 16px
    gap: spacing.sm, // 8px
  },

  // Card spacing
  card: {
    padding: spacing.lg, // 32px
    gap: spacing.base, // 16px
    borderRadius: '0.75rem', // 12px
  },
  cardCompact: {
    padding: spacing.base, // 16px
    gap: spacing.sm, // 8px
    borderRadius: '0.5rem', // 8px
  },

  // Form spacing
  form: {
    fieldGap: spacing.base, // 16px
    labelGap: spacing.xs, // 4px
    inputPadding: spacing.sm, // 8px
    inputPaddingX: spacing.base, // 16px
  },

  // Navigation spacing
  nav: {
    itemGap: spacing.lg, // 32px
    itemPadding: spacing.sm, // 8px
    logoMargin: spacing.base, // 16px
  },

  // Grid spacing
  grid: {
    gap: spacing.lg, // 32px
    gapSmall: spacing.base, // 16px
    gapLarge: spacing.xl, // 48px
  },
};

// Z-index scale for layering
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Border radius scale
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

// Shadow scale
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

// CSS custom properties for spacing and layout
export const generateSpacingCSSVariables = () => {
  return {
    // Spacing scale
    '--spacing-xs': spacing.xs,
    '--spacing-sm': spacing.sm,
    '--spacing-base': spacing.base,
    '--spacing-md': spacing.md,
    '--spacing-lg': spacing.lg,
    '--spacing-xl': spacing.xl,
    '--spacing-2xl': spacing['2xl'],
    '--spacing-3xl': spacing['3xl'],
    '--spacing-4xl': spacing['4xl'],
    '--spacing-5xl': spacing['5xl'],
    '--spacing-6xl': spacing['6xl'],

    // Breakpoints
    '--breakpoint-xs': breakpoints.xs,
    '--breakpoint-sm': breakpoints.sm,
    '--breakpoint-md': breakpoints.md,
    '--breakpoint-lg': breakpoints.lg,
    '--breakpoint-xl': breakpoints.xl,
    '--breakpoint-2xl': breakpoints['2xl'],

    // Container padding
    '--container-padding-mobile': layoutDimensions.containerPadding.mobile,
    '--container-padding-tablet': layoutDimensions.containerPadding.tablet,
    '--container-padding-desktop': layoutDimensions.containerPadding.desktop,

    // Section spacing
    '--section-spacing-mobile': layoutDimensions.sectionSpacing.mobile,
    '--section-spacing-tablet': layoutDimensions.sectionSpacing.tablet,
    '--section-spacing-desktop': layoutDimensions.sectionSpacing.desktop,

    // Border radius
    '--radius-sm': borderRadius.sm,
    '--radius-base': borderRadius.base,
    '--radius-md': borderRadius.md,
    '--radius-lg': borderRadius.lg,
    '--radius-xl': borderRadius.xl,
    '--radius-2xl': borderRadius['2xl'],
    '--radius-3xl': borderRadius['3xl'],
    '--radius-full': borderRadius.full,
  };
};

// Utility functions
export const getSpacing = (size: keyof SpacingScale) => spacing[size];
export const getBreakpoint = (size: keyof Breakpoints) => breakpoints[size];
export const getMaxWidth = (size: keyof LayoutDimensions['maxWidth']) =>
  layoutDimensions.maxWidth[size];
export const getZIndex = (level: keyof typeof zIndex) => zIndex[level];
export const getBorderRadius = (size: keyof typeof borderRadius) =>
  borderRadius[size];
export const getShadow = (size: keyof typeof shadows) => shadows[size];

/**
 * Typography Configuration for Darius Pizza
 *
 * This file defines the complete typography system including font families,
 * font sizes, line heights, font weights, and letter spacing for the pizzeria brand.
 * The typography system follows modern design principles with good readability
 * and accessibility considerations.
 */

export interface FontFamily {
  primary: string;
  secondary: string;
  mono: string;
}

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

export interface FontWeight {
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
}

export interface LineHeight {
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
}

export interface LetterSpacing {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

// Font families - Using Google Fonts for web compatibility
export const fontFamilies: FontFamily = {
  // Primary: Playfair Display - Elegant serif for headings (pizzeria elegance)
  primary: '"Playfair Display", "Times New Roman", serif',

  // Secondary: Inter - Modern sans-serif for body text (clean readability)
  secondary: '"Inter", "Helvetica Neue", "Arial", sans-serif',

  // Mono: JetBrains Mono - For code and technical content
  mono: '"JetBrains Mono", "Monaco", "Consolas", monospace',
};

// Font sizes - Responsive scale following 1.25 ratio (Major Third)
export const fontSizes: FontSize = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem', // 48px
  '6xl': '3.75rem', // 60px
};

// Font weights
export const fontWeights: FontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

// Line heights - Optimized for readability
export const lineHeights: LineHeight = {
  tight: '1.25', // For headings
  snug: '1.375', // For subheadings
  normal: '1.5', // For body text
  relaxed: '1.625', // For long-form content
  loose: '1.75', // For very long content
};

// Letter spacing
export const letterSpacings: LetterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

// Typography scale for different text elements
export const typographyScale = {
  // Headings
  h1: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['5xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  h2: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.tight,
  },
  h3: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  h4: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacings.normal,
  },
  h5: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  h6: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },

  // Body text
  body: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  bodyLarge: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacings.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },

  // UI elements
  button: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.wide,
  },
  buttonSmall: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.wide,
  },
  buttonLarge: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.wide,
  },

  // Special text
  caption: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
  overline: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacings.widest,
  },
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacings.normal,
  },
};

// Responsive typography - Adjusts font sizes based on screen size
export const responsiveTypography = {
  h1: {
    mobile: fontSizes['4xl'],
    tablet: fontSizes['5xl'],
    desktop: fontSizes['6xl'],
  },
  h2: {
    mobile: fontSizes['3xl'],
    tablet: fontSizes['4xl'],
    desktop: fontSizes['5xl'],
  },
  h3: {
    mobile: fontSizes['2xl'],
    tablet: fontSizes['3xl'],
    desktop: fontSizes['4xl'],
  },
  body: {
    mobile: fontSizes.base,
    tablet: fontSizes.lg,
    desktop: fontSizes.lg,
  },
};

// CSS custom properties for typography
export const generateTypographyCSSVariables = () => {
  return {
    // Font families
    '--font-primary': fontFamilies.primary,
    '--font-secondary': fontFamilies.secondary,
    '--font-mono': fontFamilies.mono,

    // Font sizes
    '--font-size-xs': fontSizes.xs,
    '--font-size-sm': fontSizes.sm,
    '--font-size-base': fontSizes.base,
    '--font-size-lg': fontSizes.lg,
    '--font-size-xl': fontSizes.xl,
    '--font-size-2xl': fontSizes['2xl'],
    '--font-size-3xl': fontSizes['3xl'],
    '--font-size-4xl': fontSizes['4xl'],
    '--font-size-5xl': fontSizes['5xl'],
    '--font-size-6xl': fontSizes['6xl'],

    // Font weights
    '--font-weight-light': fontWeights.light.toString(),
    '--font-weight-normal': fontWeights.normal.toString(),
    '--font-weight-medium': fontWeights.medium.toString(),
    '--font-weight-semibold': fontWeights.semibold.toString(),
    '--font-weight-bold': fontWeights.bold.toString(),
    '--font-weight-extrabold': fontWeights.extrabold.toString(),

    // Line heights
    '--line-height-tight': lineHeights.tight,
    '--line-height-snug': lineHeights.snug,
    '--line-height-normal': lineHeights.normal,
    '--line-height-relaxed': lineHeights.relaxed,
    '--line-height-loose': lineHeights.loose,

    // Letter spacing
    '--letter-spacing-tighter': letterSpacings.tighter,
    '--letter-spacing-tight': letterSpacings.tight,
    '--letter-spacing-normal': letterSpacings.normal,
    '--letter-spacing-wide': letterSpacings.wide,
    '--letter-spacing-wider': letterSpacings.wider,
    '--letter-spacing-widest': letterSpacings.widest,
  };
};

// Utility function to get typography style
export const getTypographyStyle = (element: keyof typeof typographyScale) => {
  return typographyScale[element];
};

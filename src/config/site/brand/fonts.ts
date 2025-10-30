/**
 * Next.js Font Configuration for Darius Pizza Brand
 *
 * This file configures Next.js font loading using next/font/google.
 * The fonts are optimized for performance with proper preloading and fallbacks.
 */

import { Playfair_Display, Inter } from 'next/font/google';

export const fontPrimary = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'], // Only load bold for LCP element
  display: 'swap',
  preload: true,
  variable: '--font-primary',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const fontSecondary = Inter({
  subsets: ['latin'],
  weight: ['400', '600'], // Only essential weights
  display: 'swap',
  preload: true,
  variable: '--font-secondary',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

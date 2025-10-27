import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';

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

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-mono',
});

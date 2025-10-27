import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';

export const fontPrimary = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
  variable: '--font-primary',
});

export const fontSecondary = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
  variable: '--font-secondary',
});

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-mono',
});

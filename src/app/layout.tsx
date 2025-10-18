import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'Darius Pizza - Authentic Italian Pizza',
  description:
    'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='theme-color' content='oklch(0.98 0.01 85)' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='format-detection' content='telephone=no' />
      </head>
      <body className='font-secondary antialiased'>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(() => { try { const saved = localStorage.getItem('darius-pizza-theme'); const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; const useDark = saved ? (saved === 'dark' || (saved === 'system' && prefersDark)) : prefersDark; const root = document.documentElement; if (useDark) { root.classList.add('dark'); } else { root.classList.remove('dark'); } } catch (_) {} })();",
          }}
        />
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}

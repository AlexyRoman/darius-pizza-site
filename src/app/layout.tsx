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
        {/* Theme color for mobile browsers - matches light theme background */}
        <meta name='theme-color' content='oklch(0.98 0.01 85)' />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: light)'
          content='oklch(0.98 0.01 85)'
        />
        <meta
          name='theme-color'
          media='(prefers-color-scheme: dark)'
          content='oklch(0.12 0.02 45)'
        />

        {/* Apple-specific status bar configuration */}
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Darius Pizza' />

        {/* Additional mobile optimizations */}
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta
          name='msapplication-navbutton-color'
          content='oklch(0.98 0.01 85)'
        />
        <meta name='msapplication-TileColor' content='oklch(0.98 0.01 85)' />
      </head>
      <body className='font-secondary antialiased'>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(() => { try { const saved = localStorage.getItem('darius-pizza-theme'); const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; let useDark = false; if (saved === 'dark') { useDark = true; } else if (saved === 'light') { useDark = false; } else { useDark = prefersDark; } const root = document.documentElement; if (useDark) { root.classList.add('dark'); root.style.setProperty('--effective-theme', 'dark'); } else { root.classList.remove('dark'); root.style.setProperty('--effective-theme', 'light'); } const theme = useDark ? 'dark' : 'light'; const metaThemeColors = document.querySelectorAll('meta[name=\"theme-color\"]'); metaThemeColors.forEach((meta) => { const media = meta.getAttribute('media'); if (!media) { meta.setAttribute('content', theme === 'dark' ? 'oklch(0.12 0.02 45)' : 'oklch(0.98 0.01 85)'); } else if (media === '(prefers-color-scheme: light)' && theme === 'light') { meta.setAttribute('content', 'oklch(0.98 0.01 85)'); } else if (media === '(prefers-color-scheme: dark)' && theme === 'dark') { meta.setAttribute('content', 'oklch(0.12 0.02 45)'); } }); const appleStatusBarStyle = document.querySelector('meta[name=\"apple-mobile-web-app-status-bar-style\"]'); if (appleStatusBarStyle) { appleStatusBarStyle.setAttribute('content', theme === 'dark' ? 'black-translucent' : 'default'); } } catch (_) {} })();",
          }}
        />
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}

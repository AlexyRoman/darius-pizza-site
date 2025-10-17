import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'Darius Pizza - Authentic Italian Pizza',
  description:
    'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='theme-color' content='#fafafa' />
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

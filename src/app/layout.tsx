import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'Darius Pizza - Authentic Italian Pizza',
  description:
    'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [{ rel: 'mask-icon', url: '/favicon.svg', color: '#5bbad5' }],
  },
  manifest: '/site.webmanifest',

  // Comprehensive Open Graph metadata
  openGraph: {
    type: 'website',
    locale: 'en',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com',
    siteName: 'Darius Pizza',
    title: 'Darius Pizza - Authentic Italian Pizza',
    description:
      'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
    images: [
      {
        url: '/static/hero-main-pizza.webp',
        width: 1200,
        height: 630,
        alt: 'Delicious authentic Italian pizza from Darius Pizza restaurant',
        type: 'image/webp',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    site: process.env.TWITTER_SITE || '@dariuspizza',
    creator: process.env.TWITTER_CREATOR || '@dariuspizza',
    title: 'Darius Pizza - Authentic Italian Pizza',
    description:
      'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
    images: ['/static/hero-main-pizza.webp'],
  },

  // Additional platform-specific metadata
  other: {
    // WhatsApp
    'whatsapp:title': 'Darius Pizza - Authentic Italian Pizza',
    'whatsapp:description':
      'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
    'whatsapp:image': '/static/hero-main-pizza.webp',

    // LinkedIn
    'linkedin:title': 'Darius Pizza - Authentic Italian Pizza',
    'linkedin:description':
      'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
    'linkedin:image': '/static/hero-main-pizza.webp',

    // Pinterest
    'pinterest:title': 'Darius Pizza - Authentic Italian Pizza',
    'pinterest:description':
      'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
    'pinterest:image': '/static/hero-main-pizza.webp',

    // Telegram
    'telegram:title': 'Darius Pizza - Authentic Italian Pizza',
    'telegram:description':
      'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
    'telegram:image': '/static/hero-main-pizza.webp',

    // Discord
    'discord:title': 'Darius Pizza - Authentic Italian Pizza',
    'discord:description':
      'Experience the authentic taste of Italy with our handcrafted pizzas made with fresh ingredients and traditional recipes.',
    'discord:image': '/static/hero-main-pizza.webp',

    // Language alternatives
    'alternate:en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com'}/en`,
    'alternate:fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com'}/fr`,
    'alternate:de': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com'}/de`,
    'alternate:it': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com'}/it`,
    'alternate:es': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com'}/es`,

    // Canonical URL
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com',

    // Additional SEO
    robots: 'index, follow',
    googlebot: 'index, follow',
    bingbot: 'index, follow',
  },

  // App links
  appLinks: {
    web: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com',
      should_fallback: true,
    },
  },

  // Category and classification
  category: 'Food & Dining',
  classification: 'Restaurant',

  // Referrer policy
  referrer: 'origin-when-cross-origin',

  // Color scheme
  colorScheme: 'light dark',

  // Theme color
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(0.98 0.01 85)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.12 0.02 45)' },
  ],
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

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { fontPrimary, fontSecondary } from '@/config/site/brand/fonts';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import { cookies } from 'next/headers';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  // Title and description are set by locale-specific layouts
  title: 'Darius Pizza',
  description: 'Darius Pizza',
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

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dariuspizza.fr'
  ),

  // Comprehensive Open Graph metadata
  openGraph: {
    type: 'website',
    locale: 'en',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dariuspizza.fr',
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

  // Alternates are handled by locale-specific layouts to avoid conflicts

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

    // Additional SEO
    robots: 'index, follow',
    googlebot: 'index, follow',
    bingbot: 'index, follow',
  },

  // App links
  appLinks: {
    web: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dariuspizza.fr',
      should_fallback: true,
    },
  },

  // Category and classification
  category: 'Food & Dining',
  classification: 'Restaurant',

  // Referrer policy
  referrer: 'origin-when-cross-origin',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',

  // Color scheme
  colorScheme: 'light dark',

  // Theme color
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(0.98 0.01 85)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.12 0.02 45)' },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout with <html>/<body> tags
  // For locale routes, the [locale]/layout.tsx provides content without html/body
  // For root-level routes like 404, this layout provides html/body
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const htmlLang = routing.locales.includes((cookieLocale as string) || '')
    ? (cookieLocale as string)
    : routing.defaultLocale;
  return (
    <html
      lang={htmlLang}
      suppressHydrationWarning
      className={`${fontPrimary.variable} ${fontSecondary.variable}`}
    >
      <head>
        {/* Ensure manifest link is always present with absolute path to avoid
            locale-prefixed fetches during client-side navigation in dev */}
        <link rel='manifest' href='/site.webmanifest' />
        {/* Preconnect for Google Fonts (Next.js recommendation) */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        {/* DNS prefetch for other external resources */}
        <link rel='dns-prefetch' href='https://www.googletagmanager.com' />

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

        {/* Preload critical resources for LCP */}
        <link
          rel='preload'
          href='/static/hero-background.webp'
          as='image'
          type='image/webp'
          fetchPriority='high'
        />
        <link
          rel='preload'
          href='/static/hero-pizza.webp'
          as='image'
          type='image/webp'
          fetchPriority='high'
        />

        {/* Fonts are loaded via next/font in config/site/brand/fonts.ts.
            Remove manual local font preloads to avoid 404s in dev when
            no local /public/fonts assets exist and rely on next/font. */}
      </head>
      <body className='font-secondary antialiased'>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "!function(){try{const t=localStorage.getItem('darius-pizza-theme'),e=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches,n='dark'===t||(!t&&e),r=document.documentElement;n?(r.classList.add('dark'),r.style.setProperty('--effective-theme','dark')):(r.classList.remove('dark'),r.style.setProperty('--effective-theme','light'))}catch(e){}}();",
          }}
        />
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}

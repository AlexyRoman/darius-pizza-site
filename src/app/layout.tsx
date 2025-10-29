import type { Metadata, Viewport } from 'next';
import './globals.css';
import { fontPrimary, fontSecondary } from '@/lib/fonts';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout with <html>/<body> tags for 404 pages and other root-level pages
  // The locale layout also has html/body, but Next.js will merge them correctly
  // For locale routes, the [locale]/layout.tsx provides html/body
  // For root-level routes like 404, this layout provides html/body
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${fontPrimary.variable} ${fontSecondary.variable}`}
    >
      <body className='font-secondary antialiased'>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html:
              "!function(){try{const t=localStorage.getItem('darius-pizza-theme'),e=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches,n='dark'===t||(!t&&e),r=document.documentElement;n?(r.classList.add('dark'),r.style.setProperty('--effective-theme','dark')):(r.classList.remove('dark'),r.style.setProperty('--effective-theme','light'))}catch(e){}}();",
          }}
        />
        {children}
      </body>
    </html>
  );
}

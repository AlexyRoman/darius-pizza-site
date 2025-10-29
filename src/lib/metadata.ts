import { Metadata, Viewport } from 'next';

export interface LocalizedMetadataOptions {
  locale: string;
  path?: string;
  customTitle?: string;
  customDescription?: string;
  type?: 'default' | 'menu' | 'info';
  publishedTime?: string;
  modifiedTime?: string;
}

export async function generateLocalizedMetadata(
  options: LocalizedMetadataOptions
): Promise<Metadata> {
  const { locale, path = '/', customTitle, customDescription } = options;

  // Import locale file directly to get proper translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const seoData = messages.seo || {};

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dariuspizza.fr';

  // Normalize path to avoid trailing slashes (e.g., /en/ -> /en)
  const normalizedPath = path === '/' ? '' : path;

  // Get localized content
  const title = customTitle || seoData.title || 'Darius Pizza';
  const description = customDescription || seoData.description || '';
  const siteName = seoData.siteName || 'Darius Pizza';

  // Generate OG image URL
  const ogImageUrl = '/static/hero-main-pizza.webp';
  const imageAlt = seoData.imageAlt || 'Darius Pizza';

  return {
    metadataBase: new URL(baseUrl),

    title,
    description,
    keywords: seoData.keywords || 'pizza',
    authors: [{ name: 'Darius Pizza' }],
    creator: 'Darius Pizza',
    publisher: 'Darius Pizza',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    // Open Graph
    openGraph: {
      type: 'website',
      locale: locale,
      url: `${baseUrl}/${locale}${normalizedPath}`,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: 'image/png',
        },
        {
          url: '/static/hero-main-pizza.webp',
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: 'image/webp',
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: process.env.TWITTER_SITE || '@dariuspizza',
      creator: process.env.TWITTER_CREATOR || '@dariuspizza',
      title,
      description,
      images: [ogImageUrl],
    },

    // Alternates (canonical and language alternatives)
    alternates: {
      canonical: `${baseUrl}/${locale}${normalizedPath}`,
      languages: {
        en: `${baseUrl}/en${normalizedPath}`,
        fr: `${baseUrl}/fr${normalizedPath}`,
        de: `${baseUrl}/de${normalizedPath}`,
        it: `${baseUrl}/it${normalizedPath}`,
        es: `${baseUrl}/es${normalizedPath}`,
        nl: `${baseUrl}/nl${normalizedPath}`,
        'x-default': `${baseUrl}/fr${normalizedPath}`,
      },
    },

    // Additional meta tags for various platforms
    other: {
      // WhatsApp
      'whatsapp:title': title,
      'whatsapp:description': description,
      'whatsapp:image': ogImageUrl,

      // LinkedIn
      'linkedin:title': title,
      'linkedin:description': description,
      'linkedin:image': ogImageUrl,

      // Pinterest
      'pinterest:title': title,
      'pinterest:description': description,
      'pinterest:image': ogImageUrl,

      // Telegram
      'telegram:title': title,
      'telegram:description': description,
      'telegram:image': ogImageUrl,

      // Discord
      'discord:title': title,
      'discord:description': description,
      'discord:image': ogImageUrl,

      // Additional SEO
      robots: 'index, follow',
      googlebot: 'index, follow',
      bingbot: 'index, follow',
    },

    // Verification tags
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.YANDEX_VERIFICATION || undefined,
      yahoo: process.env.YAHOO_VERIFICATION || undefined,
    },

    // App links
    appLinks: {
      web: {
        url: `${baseUrl}/${locale}${normalizedPath}`,
        should_fallback: true,
      },
    },

    // Category
    category: 'Food & Dining',

    // Classification
    classification: 'Restaurant',

    // Referrer
    referrer: 'origin-when-cross-origin',

    // iOS Safari / PWA status bar
    appleWebApp: {
      capable: true,
      // Solid dark status bar on iOS
      statusBarStyle: 'black',
    },
  };
}

export async function generatePageMetadata(
  locale: string,
  page: 'home' | 'menu' | 'info' | 'privacy' | 'cookies' | 'legalMentions',
  customTitle?: string,
  customDescription?: string
): Promise<Metadata> {
  // Import locale file directly to get proper translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const seoData = messages.seo || {};

  const pageConfig = {
    home: { path: '/', type: 'default' as const },
    menu: { path: '/menu', type: 'menu' as const },
    info: { path: '/info', type: 'info' as const },
    privacy: { path: '/privacy', type: 'default' as const },
    cookies: { path: '/cookies', type: 'default' as const },
    legalMentions: { path: '/legal-mentions', type: 'default' as const },
  };

  const config = pageConfig[page];

  // Get page-specific or fallback to default
  const pageData = seoData[page] || {};
  const title =
    customTitle || pageData.title || seoData.title || 'Darius Pizza';
  const description =
    customDescription || pageData.description || seoData.description || '';

  return generateLocalizedMetadata({
    locale,
    path: config.path,
    customTitle: title,
    customDescription: description,
    type: config.type,
  });
}

export function generateViewport(): Viewport {
  return {
    colorScheme: 'light dark',
    // Always use dark status bar/background color
    themeColor: '#191512',
  };
}

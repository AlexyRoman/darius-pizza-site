import { Metadata, Viewport } from 'next';
import { getTranslations } from 'next-intl/server';

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

  const t = await getTranslations({ locale, namespace: 'seo' });
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://darius-pizza.com';

  // Get localized content
  const title = customTitle || t('title');
  const description = customDescription || t('description');
  const siteName = t('siteName');

  // Generate OG image URL
  const ogImageUrl = '/static/hero-main-pizza.webp';

  return {
    metadataBase: new URL(baseUrl),

    title,
    description,
    keywords: t('keywords'),
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
      url: `${baseUrl}/${locale}${path}`,
      siteName,
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: t('imageAlt'),
          type: 'image/png',
        },
        {
          url: '/static/hero-main-pizza.webp',
          width: 1200,
          height: 630,
          alt: t('imageAlt'),
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

      // Language alternatives
      'alternate:en': `${baseUrl}/en${path}`,
      'alternate:fr': `${baseUrl}/fr${path}`,
      'alternate:de': `${baseUrl}/de${path}`,
      'alternate:it': `${baseUrl}/it${path}`,
      'alternate:es': `${baseUrl}/es${path}`,

      // Canonical URL
      canonical: `${baseUrl}/${locale}${path}`,
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
        url: `${baseUrl}/${locale}${path}`,
        should_fallback: true,
      },
    },

    // Category
    category: 'Food & Dining',

    // Classification
    classification: 'Restaurant',

    // Referrer
    referrer: 'origin-when-cross-origin',
  };
}

export async function generatePageMetadata(
  locale: string,
  page: 'home' | 'menu' | 'info',
  customTitle?: string,
  customDescription?: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });

  const pageConfig = {
    home: { path: '/', type: 'default' as const },
    menu: { path: '/menu', type: 'menu' as const },
    info: { path: '/info', type: 'info' as const },
  };

  const config = pageConfig[page];

  const title = customTitle || t(`${page}.title`);
  const description = customDescription || t(`${page}.description`);

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
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'oklch(0.98 0.01 85)' },
      { media: '(prefers-color-scheme: dark)', color: 'oklch(0.12 0.02 45)' },
    ],
  };
}

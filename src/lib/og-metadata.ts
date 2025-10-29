import { getTranslations } from 'next-intl/server';
import { getEnabledLocaleCodes } from '@/config/locales-config';

export interface OGMetadata {
  title: string;
  description: string;
  siteName: string;
  url: string;
  image: string;
  imageAlt: string;
  locale: string;
  type: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export interface PlatformSpecificMetadata {
  facebook: OGMetadata & {
    appId?: string;
    admins?: string[];
  };
  twitter: OGMetadata & {
    card: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    player?: string;
    app?: {
      name: string;
      id: string;
      url: string;
    };
  };
  instagram: OGMetadata;
  whatsapp: OGMetadata;
  linkedin: OGMetadata & {
    articleAuthor?: string;
    articleSection?: string;
  };
  pinterest: OGMetadata & {
    seeAlso?: string[];
  };
  telegram: OGMetadata;
  discord: OGMetadata;
}

export async function generateLocalizedOGMetadata(
  locale: string,
  path: string = '/',
  customTitle?: string,
  customDescription?: string
): Promise<PlatformSpecificMetadata> {
  const t = await getTranslations({ locale, namespace: 'seo' });
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dariuspizza.fr';

  // Normalize path to avoid trailing slashes (e.g., /en/ -> /en)
  const normalizedPath = path === '/' ? '' : path;

  // Generate localized content
  const title = customTitle || t('title');
  const description = customDescription || t('description');
  const siteName = t('siteName');

  // Base OG image using hero-main-pizza.webp
  const ogImage = `${baseUrl}/static/hero-main-pizza.webp`;

  // Create base metadata
  const baseMetadata: OGMetadata = {
    title,
    description,
    siteName,
    url: `${baseUrl}/${locale}${normalizedPath}`,
    image: ogImage,
    imageAlt: t('imageAlt'),
    locale: locale,
    type: 'website',
  };

  return {
    facebook: {
      ...baseMetadata,
      appId: process.env.FACEBOOK_APP_ID,
      admins: process.env.FACEBOOK_ADMINS?.split(','),
    },
    twitter: {
      ...baseMetadata,
      card: 'summary_large_image',
      site: process.env.TWITTER_SITE,
      creator: process.env.TWITTER_CREATOR,
    },
    instagram: baseMetadata,
    whatsapp: baseMetadata,
    linkedin: {
      ...baseMetadata,
      articleAuthor: process.env.LINKEDIN_AUTHOR,
    },
    pinterest: {
      ...baseMetadata,
      seeAlso: [`${baseUrl}/${locale}/menu`, `${baseUrl}/${locale}/info`],
    },
    telegram: baseMetadata,
    discord: baseMetadata,
  };
}

export function generateOGImageUrl(
  locale: string,
  title: string,
  type: 'default' | 'menu' | 'info' = 'default'
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dariuspizza.fr';
  const params = new URLSearchParams({
    title: title,
    locale: locale,
    type: type,
  });

  return `${baseUrl}/api/og?${params.toString()}`;
}

export function getSupportedLocales(): string[] {
  return getEnabledLocaleCodes();
}

export function getLocaleMetadata(locale: string) {
  const localeMap: Record<
    string,
    { name: string; flag: string; nativeName: string }
  > = {
    en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
    fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    de: { name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    it: { name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
    es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  };

  return localeMap[locale] || localeMap.en;
}

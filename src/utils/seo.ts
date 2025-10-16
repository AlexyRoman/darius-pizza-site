import { getEnabledLocaleCodes, getDefaultLocale } from '@/config/locales-config';

import type { Metadata } from 'next';

export type SeoMessages = {
  seo?: {
    siteName?: string;
    defaultTitle?: string;
    defaultDescription?: string;
    keywords?: string[];
    images?: string[];
  };
  pages?: Record<string, {
    title?: string;
    description?: string;
    keywords?: string[];
    images?: string[];
  }>;
};

export function buildLocalizedMetadata(args: {
  locale: string;
  messages: SeoMessages;
  basePath?: string;
  pageKey?: string;
}): Metadata {
  const { locale, messages, basePath = '', pageKey = 'home' } = args;

  const siteName = messages.seo?.siteName || '';
  const page = messages.pages?.[pageKey] || {};
  const title = page.title || messages.seo?.defaultTitle || siteName;
  const description = page.description || messages.seo?.defaultDescription || '';
  const keywords = page.keywords || messages.seo?.keywords;
  const images = page.images || messages.seo?.images || [];

  const allLocales = getEnabledLocaleCodes();

  const alternates = {
    canonical: `${basePath}/${locale}`.replace(/\/+/, '/'),
    languages: Object.fromEntries(
      allLocales.map(code => [code, `/${code}`])
    ) as Record<string, string>,
  } satisfies Metadata['alternates'];

  const rawAppUrl = process.env['NEXT_PUBLIC_APP_URL'];
  const isValidAppUrl = typeof rawAppUrl === 'string' && /^https?:\/\/.+/.test(rawAppUrl);
  const appUrl = isValidAppUrl
    ? rawAppUrl
    : process.env['NODE_ENV'] !== 'production'
      ? 'http://localhost:3000'
      : undefined;

  const toAbsoluteUrl = (pathOrUrl: string): string => {
    if (/^https?:\/_\//.test(pathOrUrl)) return pathOrUrl;
    if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
    if (!appUrl) return pathOrUrl;
    const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    return new URL(normalized, appUrl).toString();
  };

  const absoluteImages = images.map(src => toAbsoluteUrl(src));

  return {
    metadataBase: appUrl ? new URL(appUrl) : undefined,
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      siteName,
      type: 'website',
      url: toAbsoluteUrl(`/${locale}`),
      locale,
      alternateLocale: allLocales.filter(code => code !== locale),
      images: absoluteImages,
    },
    applicationName: siteName,
    keywords,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: absoluteImages,
    },
    other: {
      'x-default-locale': getDefaultLocale(),
    },
  } satisfies Metadata;
}



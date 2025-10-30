/**
 * Metadata Types
 *
 * Types for Next.js metadata generation
 */

import type { PageKey } from '@/config/site/pages';

export interface LocalizedMetadataOptions {
  locale: string;
  path?: string;
  customTitle?: string;
  customDescription?: string;
  type?: 'default' | 'menu' | 'info';
}

// Use PageKey from pages config instead of duplicating
export type PageName = PageKey;

export interface LocaleMetadata {
  name: string;
  flag: string;
  nativeName: string;
}

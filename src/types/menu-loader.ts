/**
 * Menu Loader Types
 *
 * Types for menu loading and translation system
 */

export interface MenuTranslation {
  id: string;
  title: string;
  description: string;
}

export interface MenuTranslations {
  items: MenuTranslation[];
}

export interface MenuBaseItem {
  id: string;
  price: number;
  discount: number;
  image: string;
  categories: string[];
  allergens: string[];
}

export interface MenuBase {
  items: MenuBaseItem[];
}

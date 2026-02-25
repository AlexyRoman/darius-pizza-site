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
  /**
   * Optional visibility flag.
   * When explicitly set to false, the item should be hidden from the menu.
   * If omitted or true, the item is shown.
   */
  visible?: boolean;
}

export interface MenuBase {
  items: MenuBaseItem[];
}

import type { MenuItem } from '@/types/menu';

type MenuTranslation = {
  id: string;
  title: string;
  description: string;
};

type MenuTranslations = {
  items: MenuTranslation[];
};

type MenuBaseItem = {
  id: string;
  price: number;
  discount: number;
  image: string;
  categories: string[];
  allergens: string[];
};

type MenuBase = {
  items: MenuBaseItem[];
};

// Cache for loaded modules
let menuBaseCache: MenuBase | null = null;
const translationCache: Record<string, MenuTranslations> = {};

export async function loadMenuItems(
  locale: string = 'en'
): Promise<MenuItem[]> {
  try {
    // Load base menu if not cached
    if (!menuBaseCache) {
      const baseModule = await import('@/content/menu/menu.base.json');
      menuBaseCache = baseModule.default;
    }

    // Load translation if not cached
    if (!translationCache[locale]) {
      const translationModule = await import(
        `@/content/menu/menu.translations.${locale}.json`
      );
      translationCache[locale] = translationModule.default;
    }

    const baseMenu = menuBaseCache;
    const translationData = translationCache[locale];

    // Create a map of translations by id for quick lookup
    const translationLookup = new Map<string, MenuTranslation>();
    translationData.items.forEach(item => {
      translationLookup.set(item.id, item);
    });

    // Merge base data with translations
    const mergedItems: MenuItem[] = baseMenu.items.map(baseItem => {
      const translation = translationLookup.get(baseItem.id);
      if (!translation) {
        console.warn(
          `Missing translation for menu item ${baseItem.id} in locale ${locale}`
        );
        throw new Error(`Missing translation for menu item ${baseItem.id}`);
      }

      return {
        id: baseItem.id,
        title: translation.title,
        description: translation.description,
        categories: baseItem.categories,
        price: baseItem.price,
        discount: baseItem.discount,
        image: baseItem.image,
        allergens: baseItem.allergens,
      };
    });

    return mergedItems;
  } catch (error) {
    console.warn(
      `Failed to load menu translations for locale ${locale}, falling back to English`
    );

    // Fallback to English if locale fails
    if (locale !== 'en') {
      try {
        return await loadMenuItems('en');
      } catch (fallbackError) {
        console.error(
          `Failed to load menu translations for default locale:`,
          fallbackError
        );
        throw new Error(`Unable to load menu data`);
      }
    }

    throw error;
  }
}

export function getMenuItemsSync(_locale: string): MenuItem[] {
  throw new Error(
    'getMenuItemsSync is deprecated. Use loadMenuItems() instead for async loading.'
  );
}

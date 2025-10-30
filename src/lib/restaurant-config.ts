import { getDefaultLocale } from '@/config/generic/locales-config';
import {
  RestaurantConfigMap,
  RestaurantConfigType,
  ClosingsConfig,
  MessagesConfig,
  StarredPizzasConfig,
  ContactConfig,
} from '@/types/restaurant-config';
import type {
  ClosingTranslation,
  ClosingsTranslations,
  MessageTranslation,
  MessagesTranslations,
  StarredPizzaTranslation,
  StarredPizzasTranslations,
  ContactTranslations,
  TranslationData,
} from '@/types/restaurant-config-translations';

// Re-export the type for convenience
export type { RestaurantConfigType };

// Cache for loaded modules
const baseCache: Record<
  string,
  ClosingsConfig | MessagesConfig | StarredPizzasConfig | ContactConfig
> = {};
const translationCache: Record<string, TranslationData> = {};

/**
 * Loads restaurant configuration data for a specific locale
 * Merges base data with translations like menu-loader
 * @param configType - The type of restaurant configuration to load
 * @param locale - The locale code (e.g., 'en', 'fr', 'de', 'it', 'es', 'nl')
 * @returns Promise<any> - The configuration data for the specified locale
 */
export async function loadRestaurantConfig<T extends RestaurantConfigType>(
  configType: T,
  locale: string = getDefaultLocale()
): Promise<RestaurantConfigMap[T]> {
  try {
    // Load base config if not cached
    if (!baseCache[configType]) {
      const baseModule = await import(
        `@/content/restaurant/${configType}/${configType}.base.json`
      );
      baseCache[configType] = baseModule.default;
    }

    // Load translation if not cached
    const translationKey = `${configType}:${locale}`;
    if (!translationCache[translationKey]) {
      const translationModule = await import(
        `@/content/restaurant/${configType}/${configType}.translations.${locale}.json`
      );
      translationCache[translationKey] = translationModule.default;
    }

    const baseData = baseCache[configType];
    const translationData = translationCache[translationKey];

    // Merge base data with translations based on config type
    switch (configType) {
      case 'closings':
        return mergeClosingsConfig(
          baseData as ClosingsConfig,
          translationData as ClosingsTranslations
        ) as RestaurantConfigMap[T];

      case 'messages':
        return mergeMessagesConfig(
          baseData as MessagesConfig,
          translationData as MessagesTranslations
        ) as RestaurantConfigMap[T];

      case 'starred-pizzas':
        return mergeStarredPizzasConfig(
          baseData as StarredPizzasConfig,
          translationData as StarredPizzasTranslations
        ) as RestaurantConfigMap[T];

      case 'contact':
        return mergeContactConfig(
          baseData as ContactConfig,
          translationData as ContactTranslations
        ) as RestaurantConfigMap[T];

      default:
        throw new Error(`Unknown config type: ${configType}`);
    }
  } catch (error) {
    console.warn(
      `Failed to load ${configType} config for locale ${locale}, falling back to default locale`
    );

    // Fallback to default locale if the requested locale fails
    const defaultLocale = getDefaultLocale();
    if (locale !== defaultLocale) {
      try {
        return await loadRestaurantConfig(configType, defaultLocale);
      } catch (fallbackError) {
        console.error(
          `Failed to load ${configType} config for default locale ${defaultLocale}:`,
          fallbackError
        );
        throw new Error(`Unable to load ${configType} configuration`);
      }
    }

    throw error;
  }
}

/**
 * Merges closings base data with translations
 */
function mergeClosingsConfig(
  base: ClosingsConfig,
  translations: ClosingsTranslations
): ClosingsConfig {
  const translationLookupSc = new Map<string, ClosingTranslation>();
  const translationLookupEc = new Map<string, ClosingTranslation>();

  translations.scheduledClosings?.forEach((item: ClosingTranslation) => {
    translationLookupSc.set(item.id, item);
  });
  translations.emergencyClosings?.forEach((item: ClosingTranslation) => {
    translationLookupEc.set(item.id, item);
  });

  return {
    scheduledClosings: base.scheduledClosings.map(item => {
      const translation = translationLookupSc.get(item.id);
      return {
        ...item,
        title: translation?.title || '',
        description: translation?.description || '',
      };
    }),
    emergencyClosings: base.emergencyClosings.map(item => {
      const translation = translationLookupEc.get(item.id);
      return {
        ...item,
        title: translation?.title || '',
        description: translation?.description || '',
      };
    }),
    lastUpdated: base.lastUpdated,
  };
}

/**
 * Merges messages base data with translations
 */
function mergeMessagesConfig(
  base: MessagesConfig,
  translations: MessagesTranslations
): MessagesConfig {
  const translationLookup = new Map<string, MessageTranslation>();
  translations.specialMessages?.forEach((item: MessageTranslation) => {
    translationLookup.set(item.id, item);
  });

  return {
    specialMessages: base.specialMessages.map(item => {
      const translation = translationLookup.get(item.id);
      return {
        ...item,
        title: translation?.title || '',
        message: translation?.message || '',
      };
    }),
    lastUpdated: base.lastUpdated,
  };
}

/**
 * Merges starred pizzas base data with translations
 */
function mergeStarredPizzasConfig(
  base: StarredPizzasConfig,
  translations: StarredPizzasTranslations
): StarredPizzasConfig {
  const translationLookup = new Map<string, StarredPizzaTranslation>();
  translations.starredPizzas?.forEach((item: StarredPizzaTranslation) => {
    translationLookup.set(item.id, item);
  });

  return {
    starredPizzas: base.starredPizzas.map(item => {
      const translation = translationLookup.get(item.id);
      return {
        ...item,
        title: translation?.title || '',
        description: translation?.description || '',
        starReason: translation?.starReason || '',
        category: translation?.category || item.category, // Use translated category if available
      };
    }),
    lastUpdated: base.lastUpdated,
    month: translations.month || 'January 2024', // Use translated month
  };
}

/**
 * Merges contact base data with translations (deep merge)
 */
function mergeContactConfig(
  base: ContactConfig,
  translations: ContactTranslations
): ContactConfig {
  return {
    contact: {
      ...base.contact,
      address: {
        ...base.contact.address,
        ...translations.contact?.address,
      },
    },
  };
}

/**
 * Loads multiple restaurant configuration types for a specific locale
 * @param configTypes - Array of configuration types to load
 * @param locale - The locale code (e.g., 'en', 'fr', 'de', 'it', 'es')
 * @returns Promise<Record<string, any>> - Object containing all requested configurations
 */
export async function loadMultipleRestaurantConfigs(
  configTypes: RestaurantConfigType[],
  locale: string = getDefaultLocale()
): Promise<Partial<RestaurantConfigMap>> {
  const configs: Partial<RestaurantConfigMap> = {};

  await Promise.all(
    configTypes.map(async configType => {
      try {
        const config = await loadRestaurantConfig(configType, locale);
        // Type-safe assignment using bracket notation
        (configs as Record<string, unknown>)[configType] = config;
      } catch (error) {
        console.error(`Failed to load ${configType} config:`, error);
        (configs as Record<string, unknown>)[configType] = null;
      }
    })
  );

  return configs;
}

import { getDefaultLocale } from '@/config/generic/locales-config';
import {
  RestaurantConfigMap,
  RestaurantConfigType,
} from '@/types/restaurant-config';

// Re-export the type for convenience
export type { RestaurantConfigType };

/**
 * Loads restaurant configuration data for a specific locale
 * @param configType - The type of restaurant configuration to load
 * @param locale - The locale code (e.g., 'en', 'fr', 'de', 'it', 'es')
 * @returns Promise<any> - The configuration data for the specified locale
 */
export async function loadRestaurantConfig<T extends RestaurantConfigType>(
  configType: T,
  locale: string = getDefaultLocale()
): Promise<RestaurantConfigMap[T]> {
  try {
    // Import the configuration file for the specified locale
    const config = await import(
      `@/content/restaurant/${configType}/${locale}.json`
    );
    return config.default;
  } catch (error) {
    console.warn(
      `Failed to load ${configType} config for locale ${locale}, falling back to default locale`
    );

    // Fallback to default locale if the requested locale fails
    const defaultLocale = getDefaultLocale();
    if (locale !== defaultLocale) {
      try {
        const fallbackConfig = await import(
          `@/content/restaurant/${configType}/${defaultLocale}.json`
        );
        return fallbackConfig.default;
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

/**
 * Gets all available locales for restaurant configurations
 * @returns string[] - Array of available locale codes
 */
export function getAvailableRestaurantLocales(): string[] {
  return ['en', 'fr', 'de', 'it', 'es'];
}

/**
 * Validates if a locale is supported for restaurant configurations
 * @param locale - The locale code to validate
 * @returns boolean - True if the locale is supported
 */
export function isValidRestaurantLocale(locale: string): boolean {
  return getAvailableRestaurantLocales().includes(locale);
}

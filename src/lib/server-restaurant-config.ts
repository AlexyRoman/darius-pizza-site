import {
  loadRestaurantConfig,
  loadMultipleRestaurantConfigs,
  RestaurantConfigType,
} from '@/lib/restaurant-config';
import { RestaurantConfigMap, HoursConfig } from '@/types/restaurant-config';

/**
 * Server-side function to load restaurant configuration
 * @param configType - The type of restaurant configuration to load
 * @param locale - The locale code
 * @returns Promise<any> - The configuration data
 */
export async function getRestaurantConfig<T extends RestaurantConfigType>(
  configType: T,
  locale: string
): Promise<RestaurantConfigMap[T]> {
  return await loadRestaurantConfig(configType, locale);
}

/**
 * Server-side function to load multiple restaurant configurations
 * @param configTypes - Array of configuration types to load
 * @param locale - The locale code
 * @returns Promise<Record<string, any>> - Object containing all requested configurations
 */
export async function getMultipleRestaurantConfigs(
  configTypes: RestaurantConfigType[],
  locale: string
): Promise<Partial<RestaurantConfigMap>> {
  return await loadMultipleRestaurantConfigs(configTypes, locale);
}

/**
 * Server-side function to load all restaurant configurations
 * @param locale - The locale code
 * @returns Promise<Record<string, any>> - Object containing all configurations
 */
export async function getAllRestaurantConfigs(
  locale: string
): Promise<Partial<RestaurantConfigMap>> {
  const allConfigTypes: RestaurantConfigType[] = [
    'closings',
    'messages',
    'starred-pizzas',
    'contact',
  ];

  return await getMultipleRestaurantConfigs(allConfigTypes, locale);
}

/**
 * Server-side function to get closings configuration
 * @param locale - The locale code
 * @returns Promise<any> - The closings configuration
 */
export async function getClosingsConfig(
  locale: string
): Promise<RestaurantConfigMap['closings']> {
  return (await getRestaurantConfig(
    'closings',
    locale
  )) as RestaurantConfigMap['closings'];
}

/**
 * Server-side function to get messages configuration
 * @param locale - The locale code
 * @returns Promise<any> - The messages configuration
 */
export async function getMessagesConfig(
  locale: string
): Promise<RestaurantConfigMap['messages']> {
  return (await getRestaurantConfig(
    'messages',
    locale
  )) as RestaurantConfigMap['messages'];
}

/**
 * Server-side function to get starred pizzas configuration
 * @param locale - The locale code
 * @returns Promise<any> - The starred pizzas configuration
 */
export async function getStarredPizzasConfig(
  locale: string
): Promise<RestaurantConfigMap['starred-pizzas']> {
  return (await getRestaurantConfig(
    'starred-pizzas',
    locale
  )) as RestaurantConfigMap['starred-pizzas'];
}

/**
 * Server-side function to get hours configuration
 * @param locale - The locale code
 * @returns Promise<any> - The hours configuration
 */
export async function getHoursConfig(): Promise<HoursConfig> {
  // Hours are not localized, so we import the static file
  const hoursConfig = await import('@/content/restaurant/hours.json');
  return hoursConfig.default;
}

/**
 * Server-side function to get contact configuration
 * @param locale - The locale code
 * @returns Promise<any> - The contact configuration
 */
export async function getContactConfig(
  locale: string
): Promise<RestaurantConfigMap['contact']> {
  return (await getRestaurantConfig(
    'contact',
    locale
  )) as RestaurantConfigMap['contact'];
}

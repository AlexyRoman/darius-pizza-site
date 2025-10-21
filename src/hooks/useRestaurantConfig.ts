'use client';

import { useState, useEffect } from 'react';
import {
  loadRestaurantConfig,
  loadMultipleRestaurantConfigs,
  RestaurantConfigType,
} from '@/lib/restaurant-config';
import { RestaurantConfigMap } from '@/types/restaurant-config';

/**
 * Hook to load a single restaurant configuration
 * @param configType - The type of restaurant configuration to load
 * @param locale - The locale code (optional, will use current locale from context)
 * @returns Object containing the configuration data, loading state, and error
 */
export function useRestaurantConfig<T extends RestaurantConfigType>(
  configType: T,
  locale?: string
) {
  const [data, setData] = useState<RestaurantConfigMap[T] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const configData = await loadRestaurantConfig(configType, locale);
        setData(configData);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load configuration')
        );
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [configType, locale]);

  return { data, loading, error };
}

/**
 * Hook to load multiple restaurant configurations
 * @param configTypes - Array of configuration types to load
 * @param locale - The locale code (optional, will use current locale from context)
 * @returns Object containing all configurations, loading state, and error
 */
export function useMultipleRestaurantConfigs(
  configTypes: RestaurantConfigType[],
  locale?: string
) {
  const [data, setData] = useState<Partial<RestaurantConfigMap>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadConfigs = async () => {
      try {
        setLoading(true);
        setError(null);
        const configsData = await loadMultipleRestaurantConfigs(
          configTypes,
          locale
        );
        setData(configsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to load configurations')
        );
      } finally {
        setLoading(false);
      }
    };

    loadConfigs();
  }, [configTypes.join(','), locale]); // Use join to create stable dependency

  return { data, loading, error };
}

/**
 * Hook to load all restaurant configurations
 * @param locale - The locale code (optional, will use current locale from context)
 * @returns Object containing all configurations, loading state, and error
 */
export function useAllRestaurantConfigs(locale?: string) {
  const allConfigTypes: RestaurantConfigType[] = [
    'closings',
    'messages',
    'starred-pizzas',
    'contact',
  ];

  return useMultipleRestaurantConfigs(allConfigTypes, locale);
}

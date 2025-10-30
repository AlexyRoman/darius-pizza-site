// Minimal mock to avoid ESM issues in Jest
export const useTranslations = () => (key: string) => key;
export const useLocale = () => 'en';
export const NextIntlClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => children as React.ReactElement;

// Add hasLocale and getRequestConfig for server-side testing
export const hasLocale = (
  locales: string[],
  locale: string | undefined
): boolean => {
  return locale !== undefined && locales.includes(locale);
};

export const getRequestConfig = <T>(configFn: T): T => {
  // Return the config function itself so it can be tested
  return configFn;
};

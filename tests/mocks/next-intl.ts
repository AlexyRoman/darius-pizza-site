// Minimal mock to avoid ESM issues in Jest
export const useTranslations = () => (key: string) => key;
export const useLocale = () => 'en';
export const NextIntlClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => children as React.ReactElement;

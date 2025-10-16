import { getEnabledLocaleCodes, getDefaultLocale } from '@/config/locales-config';

const config = {
  locales: getEnabledLocaleCodes(),
  defaultLocale: getDefaultLocale(),
};

export default config;



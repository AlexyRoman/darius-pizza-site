import { getEnabledLocaleCodes, getDefaultLocale } from '@/config/generic/locales-config';

const config = {
  locales: getEnabledLocaleCodes(),
  defaultLocale: getDefaultLocale(),
};

export default config;



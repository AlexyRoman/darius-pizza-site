declare module 'next-intl/middleware' {
  type NextIntlMiddleware = (req: unknown) => unknown;
  const createMiddleware: (config?: unknown) => NextIntlMiddleware;
  export default createMiddleware;
}

declare module 'next-intl/plugin' {
  type WithNextIntl = <T>(config: T) => T;
  const createNextIntlPlugin: (config?: unknown) => WithNextIntl;
  export default createNextIntlPlugin;
}

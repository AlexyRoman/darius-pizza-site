/**
 * Edge-safe protected routes (imports JSON at build time, no fs).
 * Used by middleware and @/lib/auth.
 */
import config from './protected-routes.json';

const ROUTES: string[] = config.routes ?? [];

export function getProtectedRoutes(): string[] {
  return ROUTES;
}

export function isRouteProtected(path: string): boolean {
  return ROUTES.some(r => path === r || path.startsWith(`${r}/`));
}

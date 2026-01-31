import { cookies } from 'next/headers';

import { AUTH_COOKIE_NAME } from '@/lib/auth-constants';

export {
  getProtectedRoutes,
  isRouteProtected,
} from '@/config/site/protected-routes';

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_COOKIE_NAME);
    return authToken?.value === 'authenticated';
  } catch {
    return false;
  }
}

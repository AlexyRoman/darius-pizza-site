import { PasswordForm } from './PasswordForm';

import { isAuthenticated, isRouteProtected } from '@/lib/auth';

type RouteGuardProps = {
  path: string;
  locale: string;
  children: React.ReactNode;
};

export async function RouteGuard({ path, locale, children }: RouteGuardProps) {
  if (!isRouteProtected(path)) {
    return <>{children}</>;
  }

  const authenticated = await isAuthenticated();

  if (!authenticated) {
    const redirectTo = `/${locale}${path}`;
    return (
      <PasswordForm
        locale={locale}
        redirectTo={redirectTo}
        onSuccess={() => {}}
      />
    );
  }

  return <>{children}</>;
}

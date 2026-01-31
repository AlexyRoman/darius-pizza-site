import { redirect } from 'next/navigation';

import { isAuthenticated } from '@/lib/auth';
import { PasswordForm } from '@/components/auth/PasswordForm';

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: 'Protected Content',
  description: 'This content is password protected.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Protected Content',
    description: 'This content is password protected.',
  },
};

export default async function AuthGatePage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const sp = searchParams ? await searchParams : {};
  const r = Array.isArray(sp?.redirect) ? sp.redirect[0] : sp?.redirect;
  const redirectTo =
    typeof r === 'string' && r.startsWith('/') ? r : `/${locale}`;

  if (await isAuthenticated()) {
    redirect(redirectTo);
  }

  return <PasswordForm locale={locale} redirectTo={redirectTo} />;
}

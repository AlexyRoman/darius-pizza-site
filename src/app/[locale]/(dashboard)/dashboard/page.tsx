import { setRequestLocale } from 'next-intl/server';

import { DashboardHomeCards } from '@/components/dashboard/DashboardHomeCards';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DashboardHomeCards />;
}

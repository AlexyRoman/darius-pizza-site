import { setRequestLocale } from 'next-intl/server';

import { ClosingsEditor } from '@/components/auth/ClosingsEditor';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ClosingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='max-w-3xl'>
      <ClosingsEditor />
    </div>
  );
}

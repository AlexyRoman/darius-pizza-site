import { setRequestLocale } from 'next-intl/server';

import { OpeningHoursEditor } from '@/components/auth/OpeningHoursEditor';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OpeningHoursPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='max-w-3xl'>
      <OpeningHoursEditor />
    </div>
  );
}

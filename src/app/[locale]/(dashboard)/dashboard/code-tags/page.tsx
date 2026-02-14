import { setRequestLocale } from 'next-intl/server';

import { CodeTagsView } from '@/components/dashboard/CodeTagsView';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CodeTagsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='max-w-3xl'>
      <CodeTagsView />
    </div>
  );
}

import { setRequestLocale } from 'next-intl/server';

import { MessagesEditor } from '@/components/auth/MessagesEditor';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function MessagesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className='max-w-3xl'>
      <MessagesEditor />
    </div>
  );
}

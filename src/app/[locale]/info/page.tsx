import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import InfoContent from './InfoContent';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata(locale, 'info');
}

export default function InfoPage() {
  return <InfoContent />;
}

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import PrivacyContent from './PrivacyContent';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata(locale, 'privacy');
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}

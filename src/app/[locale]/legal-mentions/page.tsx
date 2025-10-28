import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import LegalMentionsContent from './LegalMentionsContent';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata(locale, 'legalMentions');
}

export default function LegalMentionsPage() {
  return <LegalMentionsContent />;
}

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import CookiesContent from './CookiesContent';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata(locale, 'cookies');
}

export default function CookiesPage() {
  return <CookiesContent />;
}

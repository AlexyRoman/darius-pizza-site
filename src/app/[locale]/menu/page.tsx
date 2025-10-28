import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import MenuContent from './MenuContent';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata(locale, 'menu');
}

export default function MenuPage() {
  return <MenuContent />;
}

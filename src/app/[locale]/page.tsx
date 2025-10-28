import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import HomeContent from './HomeContent';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  return generatePageMetadata(locale, 'home');
}

export default function Home() {
  return <HomeContent />;
}

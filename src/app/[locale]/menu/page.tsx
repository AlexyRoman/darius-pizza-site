import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import MenuContent from './MenuContent';
import { loadMenuItems } from '@/lib/menu-loader';
import { env } from '@/lib/env';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;

  return generatePageMetadata(locale, 'menu');
}

export const revalidate = 86400; // revalidate menu page daily

export default async function MenuPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const items = await loadMenuItems(locale);

  // Prepare simple JSON-LD for Menu items
  const currencySymbol = env.NEXT_PUBLIC_CURRENCY ?? '€';
  const currencyCode = currencySymbol === '$' ? 'USD' : 'EUR';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Darius Pizza Menu',
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: 'All',
        hasMenuItem: items.map(i => ({
          '@type': 'MenuItem',
          name: i.title,
          description: i.description,
          image: i.image || undefined,
          offers: {
            '@type': 'Offer',
            price: i.price,
            priceCurrency: currencyCode,
          },
        })),
      },
    ],
  } as const;

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MenuContent initialMenuItems={items} />
    </>
  );
}

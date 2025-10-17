'use client';

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Wheat, Egg, Milk, UtensilsCrossed, Fish, Shell, Bean, Nut, Sprout, Leaf, Flower, TriangleAlert } from 'lucide-react';
import { } from '@/components/ui/tooltip';
import { } from '@/components/ui/popover';
// Tooltips/Popovers removed per request; render plain icons

import * as React from 'react';
import MenuFilters from './MenuFilters';
import menuEn from '@/content/menu/menu.en.json';
import menuFr from '@/content/menu/menu.fr.json';
import menuDe from '@/content/menu/menu.de.json';
import menuIt from '@/content/menu/menu.it.json';
import menuEs from '@/content/menu/menu.es.json';
import { isItemCtaEnabled } from '@/config/feature-flags';
import { formatCurrency } from '@/config/site';
import { AllergenLegend } from '@/components/header/AllergenLegend';
import { useLocale, useTranslations } from 'next-intl';

type MenuItem = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  badges?: string[];
  price: number;
  discount?: number; // percentage 0-100
  image?: string;
  allergens?: string[]; // e.g., ["Gluten","Milk","Nuts"] always in EN keys
};

function getMenuItemsForLocale(locale: string): MenuItem[] {
  switch (locale) {
    case 'fr':
      return (menuFr as { items: MenuItem[] }).items;
    case 'de':
      return (menuDe as { items: MenuItem[] }).items;
    case 'it':
      return (menuIt as { items: MenuItem[] }).items;
    case 'es':
      return (menuEs as { items: MenuItem[] }).items;
    case 'en':
    default:
      return (menuEn as { items: MenuItem[] }).items;
  }
}

export default function MenuPage() {
  const t = useTranslations('menu');
  const tAllergens = useTranslations('allergens');
  const locale = useLocale();
  const [filters, setFilters] = React.useState<{
    category: string | null;
    query: string;
  }>({
    category: null,
    query: '',
  });

  const ALL_ITEMS: MenuItem[] = React.useMemo(
    () => getMenuItemsForLocale(locale),
    [locale]
  );

  const normalizeAllergenKey = React.useCallback((raw: string): string => {
    const k = raw.toLowerCase().trim();
    if (k === 'sulphites') return 'sulfites';
    if (k === 'mollusks') return 'molluscs';
    if (k === 'soya') return 'soy';
    if (k === 'peanut') return 'peanuts';
    if (k === 'egg') return 'eggs';
    if (k === 'crustacean') return 'crustaceans';
    return k;
  }, []);

  const categories = React.useMemo(() => {
    return Array.from(new Set(ALL_ITEMS.flatMap(i => i.categories)));
  }, [ALL_ITEMS]);

  const filtered = React.useMemo(() => {
    return ALL_ITEMS.filter(item => {
      const matchCategory =
        !filters.category || item.categories.includes(filters.category);
      const q = filters.query.trim().toLowerCase();
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [filters, ALL_ITEMS]);

  return (
    <section className='relative overflow-hidden'>
      <div className='mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12'>
        <div className='mb-6 rounded-2xl border border-white/10 ring-1 ring-border bg-background/30 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 p-4 sm:p-6 shadow-sm'>
          <div className='grid grid-cols-[2fr_1fr] gap-3 sm:gap-4'>
            {/* Top-left: icon + title + subtitle */}
            <div className='min-h-12 flex items-center gap-2 sm:gap-3'>
              <span className='flex size-9 md:size-10 items-center justify-center rounded-full border border-white/10 ring-1 ring-border bg-background/40'>
                <UtensilsCrossed className='size-4 md:size-5 text-foreground' />
              </span>
              <div>
                <h1 className='text-xl md:text-3xl font-semibold tracking-tight'>
                  {t('title', { default: 'Menu' })}
                </h1>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  {t('subtitle', { default: 'Discover our selection' })}
                </p>
              </div>
            </div>

            {/* Top-right: allergens */}
            <div className='col-start-2 min-h-12 flex flex-row justify-end items-center gap-2'>
              <span className='text-xs md:text-xs text-muted-foreground'>
                {t('allergens', { default: 'Allergens' })}
              </span>
              <AllergenLegend />
            </div>

            {/* Bottom row full-width: filters (left) + items badge (right) */}
            <div className='col-span-2 min-h-12 flex flex-wrap items-center gap-2'>
              <div className='flex min-w-0 items-center flex-1'>
                <MenuFilters
                  categories={categories}
                  value={filters}
                  onChange={setFilters}
                />
              </div>
              <Badge
                variant='secondary'
                className='px-2 py-1 text-xs md:text-sm shrink-0 ml-auto w-full sm:w-auto text-right sm:text-left'
              >
                {t('itemsCount', {
                  count: filtered.length,
                  default: `${filtered.length} items`,
                })}
              </Badge>
            </div>
          </div>
        </div>
        <ItemGroup className='gap-4'>
          {filtered.map(data => {
            const hasDiscount = (data.discount ?? 0) > 0;
            const finalPrice = hasDiscount
              ? Number(
                  (data.price * (1 - (data.discount as number) / 100)).toFixed(
                    2
                  )
                )
              : data.price;
            const imageSrc = data.image || '/product-placeholder.svg';
            return (
              <Item
                key={data.id}
                variant='outline'
                className='w-full items-start flex-col md:flex-row'
              >
                <ItemMedia className='shrink-0 w-full md:w-auto'>
                  <Image
                    src={imageSrc}
                    alt={`${data.title} image`}
                    width={156}
                    height={156}
                    className='rounded-md object-cover w-full h-40 sm:h-48 md:w-[156px] md:h-[156px]'
                    sizes='(max-width: 768px) 100vw, 156px'
                    priority
                  />
                </ItemMedia>
                <ItemContent className='gap-2'>
                  <div className='mb-3 flex items-center gap-3'>
                    <div className='flex flex-wrap items-center gap-2'>
                      {(data.badges && data.badges.length > 0
                        ? data.badges
                        : data.categories
                      ).map(cat => (
                        <Badge
                          key={cat}
                          variant={
                            cat === 'Vegetarian' || cat === 'Gluten-free'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  {data.allergens && data.allergens.length > 0 && (
                    <div className='flex items-center gap-1'>
                      {data.allergens.map(key => {
                        const k = normalizeAllergenKey(key);
                        const Icon =
                          k === 'gluten' ? Wheat :
                          k === 'eggs' || k === 'egg' ? Egg :
                          k === 'milk' ? Milk :
                          k === 'fish' ? Fish :
                          k === 'crustaceans' || k === 'crustacean' ? Shell :
                          k === 'peanuts' ? Bean :
                          k === 'nuts' ? Nut :
                          k === 'sesame' ? Sprout :
                          k === 'mustard' ? Leaf :
                          k === 'soy' ? Bean :
                          k === 'celery' ? Leaf :
                          k === 'lupin' ? Flower :
                          k === 'sulfites' ? TriangleAlert :
                          k === 'molluscs' ? Shell :
                          Shell;
                        return (
                          <span key={key} className='flex size-6 items-center justify-center rounded-full border bg-muted text-muted-foreground'>
                            <Icon className='size-3' />
                          </span>
                        );
                      })}
                    </div>
                  )}
                  </div>
                  <ItemTitle>{data.title}</ItemTitle>
                  <ItemDescription>{data.description}</ItemDescription>
                </ItemContent>
                <ItemActions className='min-w-[140px] self-center w-full flex flex-row items-center justify-between gap-3 md:w-auto md:flex-col md:justify-center md:text-center'>
                  <div className='flex items-center gap-2 md:flex-col'>
                    <div className='text-lg font-semibold order-1 md:order-2'>
                      {formatCurrency(finalPrice)}
                    </div>
                    {hasDiscount && (
                      <Badge variant='secondary' className='order-2 md:order-1'>
                        -{data.discount}%
                      </Badge>
                    )}
                  </div>
                  {isItemCtaEnabled() && (
                    <Button size='sm' variant='outline' className='md:mt-3'>
                      {t('cta.action', { default: 'Action' })}
                    </Button>
                  )}
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>
      </div>
    </section>
  );
}

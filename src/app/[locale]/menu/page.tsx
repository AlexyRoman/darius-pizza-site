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
import {
  Wheat,
  Egg,
  Milk,
  UtensilsCrossed,
  Fish,
  Shell,
  Bean,
  Nut,
  Sprout,
  Leaf,
  Flower,
  Bubbles,
  Carrot,
} from 'lucide-react';
import {} from '@/components/ui/popover';

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

  const [visibleTooltip, setVisibleTooltip] = React.useState<string | null>(
    null
  );
  const [hoveredTooltip, setHoveredTooltip] = React.useState<string | null>(
    null
  );

  // Hide tooltip when clicking elsewhere (mobile only)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.allergen-trigger')) {
        setVisibleTooltip(null);
      }
    };

    if (visibleTooltip) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [visibleTooltip]);

  const ALL_ITEMS: MenuItem[] = React.useMemo(
    () => getMenuItemsForLocale(locale),
    [locale]
  );

  const normalizeAllergenKey = React.useCallback((raw: string): string => {
    const k = raw.toLowerCase().trim();
    if (k === 'vegetarian') return 'vegetarian';
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
                  <div className='mb-3 flex items-center justify-between gap-3 md:justify-start'>
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
                      {data.allergens && data.allergens.length > 0 && (
                        <div className='hidden md:flex items-center gap-1'>
                          {data.allergens.map(key => {
                            const k = normalizeAllergenKey(key);
                            const Icon =
                              k === 'vegetarian'
                                ? Carrot
                                : k === 'gluten'
                                  ? Wheat
                                  : k === 'eggs' || k === 'egg'
                                    ? Egg
                                    : k === 'milk'
                                      ? Milk
                                      : k === 'fish'
                                        ? Fish
                                        : k === 'crustaceans' ||
                                            k === 'crustacean'
                                          ? Fish
                                          : k === 'peanuts'
                                            ? Bean
                                            : k === 'nuts'
                                              ? Nut
                                              : k === 'sesame'
                                                ? Leaf
                                                : k === 'mustard'
                                                  ? Sprout
                                                  : k === 'soy'
                                                    ? Bean
                                                    : k === 'celery'
                                                      ? Carrot
                                                      : k === 'lupin'
                                                        ? Flower
                                                        : k === 'sulfites'
                                                          ? Bubbles
                                                          : k === 'molluscs'
                                                            ? Shell
                                                            : Shell;
                            const tooltipId = `${data.id}-${key}`;
                            return (
                              <div key={key} className='relative inline-block'>
                                <span
                                  className={`allergen-trigger flex size-6 items-center justify-center rounded-full border cursor-pointer transition-colors ${
                                    k === 'vegetarian'
                                      ? 'border-green-200 bg-green-100 text-green-600 hover:bg-green-200'
                                      : 'border-orange-200 bg-orange-100 text-orange-600 hover:bg-orange-200'
                                  }`}
                                  onClick={() =>
                                    setVisibleTooltip(
                                      visibleTooltip === tooltipId
                                        ? null
                                        : tooltipId
                                    )
                                  }
                                  onMouseEnter={() =>
                                    setHoveredTooltip(tooltipId)
                                  }
                                  onMouseLeave={() => setHoveredTooltip(null)}
                                >
                                  <Icon className='size-3' />
                                </span>
                                {/* Mobile: Click tooltip */}
                                {visibleTooltip === tooltipId && (
                                  <div
                                    className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 md:hidden ${
                                      k === 'vegetarian'
                                        ? 'bg-green-600'
                                        : 'bg-orange-600'
                                    }`}
                                  >
                                    {tAllergens(k)}
                                    <div
                                      className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                                        k === 'vegetarian'
                                          ? 'border-t-green-600'
                                          : 'border-t-orange-600'
                                      }`}
                                    ></div>
                                  </div>
                                )}
                                {/* Desktop: Hover tooltip */}
                                {hoveredTooltip === tooltipId && (
                                  <div
                                    className={`hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 ${
                                      k === 'vegetarian'
                                        ? 'bg-green-600'
                                        : 'bg-orange-600'
                                    }`}
                                  >
                                    {tAllergens(k)}
                                    <div
                                      className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                                        k === 'vegetarian'
                                          ? 'border-t-green-600'
                                          : 'border-t-orange-600'
                                      }`}
                                    ></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    {data.allergens && data.allergens.length > 0 && (
                      <div className='flex md:hidden items-center gap-1'>
                        {data.allergens.map(key => {
                          const k = normalizeAllergenKey(key);
                          const Icon =
                            k === 'vegetarian'
                              ? Carrot
                              : k === 'gluten'
                                ? Wheat
                                : k === 'eggs' || k === 'egg'
                                  ? Egg
                                  : k === 'milk'
                                    ? Milk
                                    : k === 'fish'
                                      ? Fish
                                      : k === 'crustaceans' ||
                                          k === 'crustacean'
                                        ? Fish
                                        : k === 'peanuts'
                                          ? Bean
                                          : k === 'nuts'
                                            ? Nut
                                            : k === 'sesame'
                                              ? Leaf
                                              : k === 'mustard'
                                                ? Sprout
                                                : k === 'soy'
                                                  ? Bean
                                                  : k === 'celery'
                                                    ? Carrot
                                                    : k === 'lupin'
                                                      ? Flower
                                                      : k === 'sulfites'
                                                        ? Bubbles
                                                        : k === 'molluscs'
                                                          ? Shell
                                                          : Shell;
                          const tooltipId = `${data.id}-${key}`;
                          return (
                            <div key={key} className='relative inline-block'>
                              <span
                                className={`allergen-trigger flex size-6 items-center justify-center rounded-full border cursor-pointer transition-colors ${
                                  k === 'vegetarian'
                                    ? 'border-green-200 bg-green-100 text-green-600 hover:bg-green-200'
                                    : 'border-orange-200 bg-orange-100 text-orange-600 hover:bg-orange-200'
                                }`}
                                onClick={() =>
                                  setVisibleTooltip(
                                    visibleTooltip === tooltipId
                                      ? null
                                      : tooltipId
                                  )
                                }
                                onMouseEnter={() =>
                                  setHoveredTooltip(tooltipId)
                                }
                                onMouseLeave={() => setHoveredTooltip(null)}
                              >
                                <Icon className='size-3' />
                              </span>
                              {/* Mobile: Click tooltip */}
                              {visibleTooltip === tooltipId && (
                                <div
                                  className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 md:hidden ${
                                    k === 'vegetarian'
                                      ? 'bg-green-600'
                                      : 'bg-orange-600'
                                  }`}
                                >
                                  {tAllergens(k)}
                                  <div
                                    className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                                      k === 'vegetarian'
                                        ? 'border-t-green-600'
                                        : 'border-t-orange-600'
                                    }`}
                                  ></div>
                                </div>
                              )}
                              {/* Desktop: Hover tooltip */}
                              {hoveredTooltip === tooltipId && (
                                <div
                                  className={`hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 ${
                                    k === 'vegetarian'
                                      ? 'bg-green-600'
                                      : 'bg-orange-600'
                                  }`}
                                >
                                  {tAllergens(k)}
                                  <div
                                    className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                                      k === 'vegetarian'
                                        ? 'border-t-green-600'
                                        : 'border-t-orange-600'
                                    }`}
                                  ></div>
                                </div>
                              )}
                            </div>
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

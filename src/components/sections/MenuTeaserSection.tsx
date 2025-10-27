'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Star, Utensils, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRestaurantConfig } from '@/hooks/useRestaurantConfig';
import menuEn from '@/content/menu/menu.en.json';
import menuFr from '@/content/menu/menu.fr.json';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { formatCurrency } from '@/config/site';

export default function MenuTeaserSection() {
  const t = useTranslations('menuTeaser');
  const locale = useLocale();

  // Load starred pizzas configuration with locale support
  const { data: starredPizzasConfig, loading: starredPizzasLoading } =
    useRestaurantConfig('starred-pizzas', locale);
  const starredPizzas = starredPizzasConfig?.starredPizzas || [];

  type MenuItem = { id: string; title: string; description: string };
  const menuData: MenuItem[] =
    locale === 'fr'
      ? (menuFr as { items: MenuItem[] }).items
      : (menuEn as { items: MenuItem[] }).items;
  const idToLocalized = new Map<string, MenuItem>(menuData.map(i => [i.id, i]));

  return (
    <section className='py-16 bg-gradient-to-b from-background via-background-secondary to-background-secondary'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center gap-2 mb-4'>
            <Star className='h-6 w-6 text-primary fill-primary' />
            <h2 className='text-3xl font-bold text-foreground'>
              {t('featuredThisMonth')}
            </h2>
            <Star className='h-6 w-6 text-primary fill-primary' />
          </div>
          <p className='text-lg text-foreground-secondary max-w-2xl mx-auto'>
            {t('description')}
          </p>
        </div>

        {/* Pizza Cards Grid */}
        {starredPizzasLoading ? (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center space-y-4'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p className='text-foreground-secondary'>
                Loading featured pizzas...
              </p>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
            {starredPizzas.map(pizza => (
              <Card
                key={pizza.id}
                className='group bg-background-elevated border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden'
              >
                {/* Pizza Image */}
                <div className='relative h-48 overflow-hidden'>
                  <img
                    src={pizza.image}
                    alt={pizza.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className='absolute top-3 right-3'>
                    <Badge className='bg-primary text-primary-foreground shadow-lg'>
                      <Star className='h-3 w-3 mr-1 fill-current' />
                      {t('featuredBadge')}
                    </Badge>
                  </div>
                  <div className='absolute bottom-3 left-3'>
                    <Badge
                      variant='secondary'
                      className='bg-black/70 text-white backdrop-blur-sm border-white/20'
                    >
                      {pizza.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <CardTitle className='text-xl font-bold text-foreground group-hover:text-primary transition-colors'>
                      {idToLocalized.get(pizza.id)?.title ?? pizza.title}
                    </CardTitle>
                    <div className='text-right'>
                      <div className='text-2xl font-bold text-primary'>
                        {formatCurrency(pizza.price)}
                      </div>
                    </div>
                  </div>
                  <p className='text-sm text-primary font-medium'>
                    {pizza.starReason}
                  </p>
                </CardHeader>

                <CardContent className='pt-0'>
                  <p className='text-foreground-secondary text-sm leading-relaxed mb-4'>
                    {idToLocalized.get(pizza.id)?.description ??
                      pizza.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className='text-center'>
          <div className='bg-background-elevated rounded-2xl p-8 shadow-lg border border-border/50'>
            <div className='flex items-center justify-center gap-3 mb-4'>
              <Utensils className='h-8 w-8 text-primary' />
              <h3 className='text-2xl font-bold text-foreground'>
                {t('hungryTitle')}
              </h3>
            </div>
            <p className='text-foreground-secondary mb-6 max-w-md mx-auto'>
              {t('hungryDescription')}
            </p>
            <Link href='/menu' data-gtm-click='menu_link'>
              <Button
                size='lg'
                className='!bg-primary !text-primary-foreground px-8 py-3 text-lg font-semibold shadow-lg md:hover:shadow-xl transition-all duration-300 md:hover:scale-105 hover:!bg-primary active:!bg-primary focus:!bg-primary'
              >
                {t('viewFullMenu')}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

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
import { Wheat, Egg, Milk } from 'lucide-react';
import * as React from 'react';
import MenuFilters from './MenuFilters';

type MenuItem = {
  id: string;
  title: string;
  description: string;
  categories: string[];
};

const ALL_ITEMS: MenuItem[] = [
  {
    id: '1',
    title: 'Placeholder Menu Item',
    description:
      'We will define the menu item structure here. We will define the menu item structure here. We will define the menu item structure here. We will define the menu item structure here. We will define the menu item structure here. We will define the menu item structure here.',
    categories: ['Pizza', 'Vegetarian'],
  },
  {
    id: '2',
    title: 'Another Menu Item',
    description:
      'Rich description for another placeholder menu item. Tweak as needed later.',
    categories: ['Pasta', 'Spicy'],
  },
  {
    id: '3',
    title: 'Third Menu Item',
    description: 'Third item placeholder description for layout preview.',
    categories: ['Dessert', 'Gluten-free'],
  },
];

export default function MenuPage() {
  const [filters, setFilters] = React.useState<{
    category: string | null;
    query: string;
  }>({
    category: null,
    query: '',
  });

  const categories = React.useMemo(
    () => Array.from(new Set(ALL_ITEMS.flatMap(i => i.categories))),
    []
  );

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
  }, [filters]);

  return (
    <section className='relative overflow-hidden'>
      <div className='mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-3xl md:text-4xl font-bold tracking-tight mb-6'>
          Menu
        </h1>
        <div className='mb-6'>
          <MenuFilters
            categories={categories}
            value={filters}
            onChange={setFilters}
          />
        </div>
        <ItemGroup className='gap-4'>
          {filtered.map((data, idx) => (
            <Item
              key={data.id}
              variant='outline'
              className='w-full items-start flex-col md:flex-row'
            >
              <ItemMedia className='shrink-0 w-full md:w-auto'>
                <Image
                  src='/product-placeholder.svg'
                  alt='Product image placeholder'
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
                    {data.categories.map(cat => (
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
                  <div className='flex items-center gap-1'>
                    <span className='flex size-6 items-center justify-center rounded-full border bg-muted text-muted-foreground'>
                      <Wheat className='size-3' />
                    </span>
                    <span className='flex size-6 items-center justify-center rounded-full border bg-muted text-muted-foreground'>
                      <Egg className='size-3' />
                    </span>
                    <span className='flex size-6 items-center justify-center rounded-full border bg-muted text-muted-foreground'>
                      <Milk className='size-3' />
                    </span>
                  </div>
                </div>
                <ItemTitle>{data.title}</ItemTitle>
                <ItemDescription>{data.description}</ItemDescription>
              </ItemContent>
              <ItemActions className='min-w-[140px] self-center w-full flex flex-row items-center justify-between gap-3 md:w-auto md:flex-col md:justify-center md:text-center'>
                <div className='flex items-center gap-2 md:flex-col'>
                  <div className='text-lg font-semibold order-1 md:order-2'>
                    ${(12.9 - idx).toFixed(2)}
                  </div>
                  <Badge variant='secondary' className='order-2 md:order-1'>
                    -20%
                  </Badge>
                </div>
                <Button size='sm' variant='outline' className='md:mt-3'>
                  Action
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </section>
  );
}

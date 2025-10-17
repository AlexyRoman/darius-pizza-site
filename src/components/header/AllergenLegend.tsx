'use client';

import * as React from 'react';
import {
  Info,
  Wheat,
  Egg,
  Milk,
  Fish,
  Shell,
  Bean,
  Nut,
  Sprout,
  Leaf,
  Flower,
  TriangleAlert,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

export function AllergenLegend() {
  const t = useTranslations('allergens');
  // Localized single-word (or compact) labels are provided via next-intl in page; here we keep neutral defaults
  const items = [
    { key: 'gluten', Icon: Wheat },
    { key: 'eggs', Icon: Egg },
    { key: 'milk', Icon: Milk },
    { key: 'fish', Icon: Fish },
    { key: 'peanuts', Icon: Bean },
    { key: 'crustaceans', Icon: Shell },
    { key: 'nuts', Icon: Nut },
    { key: 'sesame', Icon: Sprout },
    { key: 'mustard', Icon: Leaf },
    { key: 'soy', Icon: Bean },
    { key: 'celery', Icon: Leaf },
    { key: 'lupin', Icon: Flower },
    { key: 'sulfites', Icon: TriangleAlert },
    { key: 'molluscs', Icon: Shell },
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          aria-label='Allergens legend'
          className='rounded-full border border-white/10 ring-1 ring-border bg-background/40 backdrop-blur-md supports-[backdrop-filter]:bg-background/40 hover:bg-background/40 focus:bg-background/40 active:bg-background/40'
        >
          <Info className='size-5' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' sideOffset={10} className='w-72 p-3'>
        <ul className='max-h-56 overflow-auto pr-1 space-y-2'>
          {items.map(({ key, Icon }) => (
            <li key={key} className='flex items-center gap-2 text-sm'>
              <span className='flex size-6 items-center justify-center rounded-full border bg-muted text-muted-foreground'>
                <Icon className='size-3.5' />
              </span>
              <span className='text-foreground truncate'>{t(key)}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default AllergenLegend;

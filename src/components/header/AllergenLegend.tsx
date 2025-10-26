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
  Atom,
  Carrot,
  Carrot as Vegetable,
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
    { key: 'vegetarian', Icon: Vegetable, isVegetarian: true },
    { key: 'gluten', Icon: Wheat },
    { key: 'eggs', Icon: Egg },
    { key: 'milk', Icon: Milk },
    { key: 'fish', Icon: Fish },
    { key: 'peanuts', Icon: Bean },
    { key: 'crustaceans', Icon: Fish },
    { key: 'nuts', Icon: Nut },
    { key: 'sesame', Icon: Sprout },
    { key: 'mustard', Icon: Leaf },
    { key: 'soy', Icon: Bean },
    { key: 'celery', Icon: Carrot },
    { key: 'lupin', Icon: Flower },
    { key: 'sulfites', Icon: Atom },
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
      <PopoverContent
        align='end'
        sideOffset={10}
        className='w-72 p-3 sm:w-72 md:w-72'
        side='bottom'
        avoidCollisions={false}
        collisionPadding={0}
        sticky='always'
        onEscapeKeyDown={e => e.preventDefault()}
        onPointerDown={e => e.preventDefault()}
        onPointerUp={e => e.preventDefault()}
        onClick={e => e.preventDefault()}
        onTouchStart={e => e.preventDefault()}
        onTouchEnd={e => e.preventDefault()}
        onTouchMove={e => e.preventDefault()}
        style={{
          transform: 'none !important',
          transition: 'none !important',
          animation: 'none !important',
          pointerEvents: 'auto',
          userSelect: 'none',
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            userSelect: 'text',
            touchAction: 'auto',
            WebkitTouchCallout: 'default',
            WebkitUserSelect: 'text',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <ul className='space-y-2 pr-1 sm:max-h-56 sm:overflow-auto md:max-h-56 md:overflow-auto'>
            {items.map(({ key, Icon, isVegetarian }) => (
              <li key={key} className='flex items-center gap-2 text-sm'>
                <span
                  className={`flex size-6 items-center justify-center rounded-full border ${
                    isVegetarian
                      ? 'border-green-200 bg-green-100 text-green-600'
                      : 'border-orange-200 bg-orange-100 text-orange-600'
                  }`}
                >
                  <Icon className='size-3.5' />
                </span>
                <span className='text-foreground truncate'>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AllergenLegend;

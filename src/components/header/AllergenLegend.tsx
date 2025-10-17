'use client';

import * as React from 'react';
import { Wheat, Egg, Milk, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

export function AllergenLegend() {
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
      <PopoverContent align='end' sideOffset={10} className='w-64 p-3'>
        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <span className='flex size-7 items-center justify-center rounded-full border bg-muted text-muted-foreground'>
              <Wheat className='size-3.5' />
            </span>
            <div className='text-sm'>
              <div className='font-medium'>Gluten</div>
              <div className='text-muted-foreground text-xs'>
                Contains gluten/wheat
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='flex size-7 items-center justify-center rounded-full border bg-muted text-muted-foreground'>
              <Egg className='size-3.5' />
            </span>
            <div className='text-sm'>
              <div className='font-medium'>Eggs</div>
              <div className='text-muted-foreground text-xs'>Contains eggs</div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='flex size-7 items-center justify-center rounded-full border bg-muted text-muted-foreground'>
              <Milk className='size-3.5' />
            </span>
            <div className='text-sm'>
              <div className='font-medium'>Milk</div>
              <div className='text-muted-foreground text-xs'>
                Contains dairy
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AllergenLegend;

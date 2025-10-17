'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { withDebounce, withRateLimit, withThrottle } from '@/lib/pacer';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export type MenuFiltersProps = {
  categories: string[];
  value: { category: string | null; query: string };
  onChange: (next: { category: string | null; query: string }) => void;
};

export default function MenuFilters(props: MenuFiltersProps) {
  const { categories, value, onChange } = props;
  const [open, setOpen] = React.useState(false);
  const setCategory = React.useMemo(
    () =>
      withRateLimit((category: string | null) => {
        onChange({ category, query: value.query });
        setOpen(false);
      }),
    [onChange, value.query]
  );

  const setQuery = React.useMemo(
    () =>
      withRateLimit(
        withThrottle(
          withDebounce(
            (q: string) => onChange({ category: value.category, query: q }),
            500
          ),
          400
        )
      ),
    [onChange, value.category]
  );

  const onReset = React.useMemo(
    () =>
      withRateLimit(() => {
        onChange({ category: null, query: '' });
      }),
    [onChange]
  );

  return (
    <div className='flex w-full items-center gap-2'>
      <div className='flex items-center gap-2'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              size='sm'
              className='min-w-44 justify-between'
            >
              {value.category ?? 'All categories'}
              <ChevronsUpDownIcon className='ml-2 size-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0 min-w-56' align='start'>
            <Command>
              <CommandInput
                placeholder='Search categories...'
                className='h-10'
                onValueChange={setQuery as unknown as (v: string) => void}
              />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value='__all__'
                    onSelect={() => setCategory(null)}
                  >
                    All categories
                    <CheckIcon
                      className={cn(
                        'ml-auto',
                        !value.category ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                  {categories.map(cat => (
                    <CommandItem
                      key={cat}
                      value={cat}
                      onSelect={(current: string) => setCategory(current)}
                    >
                      {cat}
                      <CheckIcon
                        className={cn(
                          'ml-auto',
                          value.category === cat ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          variant='ghost'
          size='sm'
          onClick={onReset}
          aria-label='Reset filters'
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

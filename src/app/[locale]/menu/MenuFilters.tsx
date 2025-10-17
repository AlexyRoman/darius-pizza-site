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
import { useTranslations } from 'next-intl';

export type MenuFiltersProps = {
  categories: string[];
  value: { category: string | null; query: string };
  onChange: (next: { category: string | null; query: string }) => void;
};

export default function MenuFilters(props: MenuFiltersProps) {
  const { categories, value, onChange } = props;
  const t = useTranslations('menu.filters');
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
      <div className='flex items-center gap-2 min-w-0 w-full sm:w-auto'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              size='sm'
              className='justify-between min-w-0 shrink-0 w-48 md:w-64 overflow-hidden text-ellipsis whitespace-nowrap'
            >
              <span className='truncate'>
                {value.category ?? t('allCategories')}
              </span>
              <ChevronsUpDownIcon className='ml-2 size-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0 min-w-56' align='start'>
            <Command>
              <CommandInput
                placeholder={t('searchCategories')}
                className='h-10'
                onValueChange={setQuery as unknown as (v: string) => void}
              />
              <CommandList>
                <CommandEmpty>{t('noCategoryFound')}</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value='__all__'
                    onSelect={() => setCategory(null)}
                  >
                    {t('allCategories')}
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
          aria-label={t('reset')}
          className='min-w-[7.5rem] justify-center shrink-0'
        >
          {t('reset')}
        </Button>
      </div>
    </div>
  );
}

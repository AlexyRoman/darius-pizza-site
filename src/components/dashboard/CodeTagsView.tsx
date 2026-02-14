'use client';

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { RefreshCw, Tag } from 'lucide-react';

import { withThrottle } from '@/lib/pacer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const CODE_TAGS_QUERY_KEY = ['dashboard', 'code-tags'] as const;
const STALE_TIME_MS = 60_000;
const REFRESH_THROTTLE_MS = 2000;

async function fetchCodeTags(): Promise<{
  codes: { code: string; count: number }[];
}> {
  const res = await fetch('/api/dashboard/code-tags', {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(
      res.status === 401 ? 'Unauthorized' : 'Failed to load code tags'
    );
  }
  return res.json();
}

export function CodeTagsView() {
  const t = useTranslations('dashboard.codeTags');
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: CODE_TAGS_QUERY_KEY,
    queryFn: fetchCodeTags,
    staleTime: STALE_TIME_MS,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const throttledRefetch = useCallback(() => {
    withThrottle(() => void refetch(), REFRESH_THROTTLE_MS)();
  }, [refetch]);

  if (isLoading && !data) {
    return (
      <div className='space-y-4'>
        <p className='text-muted-foreground'>{t('loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='space-y-4'>
        <p className='text-destructive'>{error?.message ?? t('error')}</p>
        <Button variant='outline' onClick={() => void refetch()}>
          {t('retry')}
        </Button>
      </div>
    );
  }

  const codes = data?.codes ?? [];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>{t('title')}</h1>
          <p className='text-muted-foreground mt-1'>{t('description')}</p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={throttledRefetch}
          disabled={isFetching}
          aria-label={t('refresh')}
        >
          <RefreshCw
            className={`size-4 shrink-0 ${isFetching ? 'animate-spin' : ''}`}
          />
          <span className='ml-2'>{t('refresh')}</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Tag className='size-5' />
            {t('tableTitle')}
          </CardTitle>
          <CardDescription>{t('tableDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          {codes.length === 0 ? (
            <p className='text-muted-foreground py-6 text-center'>
              {t('empty')}
            </p>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='pb-2 font-medium'>{t('columnCode')}</th>
                    <th className='pb-2 font-medium'>{t('columnCount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map(({ code, count }) => (
                    <tr key={code} className='border-b last:border-0'>
                      <td className='py-3 font-mono'>{code}</td>
                      <td className='py-3'>{count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

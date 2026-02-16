'use client';

import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations, useLocale } from 'next-intl';
import { RefreshCw } from 'lucide-react';

import { withThrottle } from '@/lib/pacer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type CodeTag = { code: string; count: number };

async function fetchCodeTags(): Promise<{ codes: CodeTag[] }> {
  const res = await fetch('/api/dashboard/code-tags');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export function CodeTagsView() {
  const t = useTranslations('dashboard.codeTags');
  const locale = useLocale();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', 'code-tags'],
    queryFn: fetchCodeTags,
    staleTime: 60_000,
    refetchInterval: 120_000,
    refetchOnWindowFocus: false,
  });

  const throttledRefetch = useCallback(
    withThrottle(() => refetch(), 2000),
    [refetch]
  );

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dariuspizza.fr';

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>{t('loading')}</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-destructive'>{t('error')}</p>
          <Button variant='outline' onClick={() => refetch()} className='mt-2'>
            {t('retry')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const codes = data?.codes ?? [];

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </div>
        <Button
          variant='outline'
          size='icon'
          onClick={throttledRefetch}
          aria-label={t('refresh')}
        >
          <RefreshCw className='size-4' />
        </Button>
      </CardHeader>
      <CardContent>
        {codes.length === 0 ? (
          <p className='text-muted-foreground'>{t('empty')}</p>
        ) : (
          <div className='space-y-3'>
            {codes.map(({ code, count }) => (
              <div
                key={code}
                className='flex items-center justify-between rounded-lg border p-3'
              >
                <div>
                  <span className='font-medium'>{code}</span>
                  <span className='ml-2 text-muted-foreground'>
                    {t('count', { count })}
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    const url = `${baseUrl}/${locale}?qr=${code}`;
                    void navigator.clipboard.writeText(url);
                  }}
                >
                  {t('copyLink')}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

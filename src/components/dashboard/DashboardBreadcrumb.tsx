'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function DashboardBreadcrumb() {
  const t = useTranslations('dashboard.breadcrumb');
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'fr';
  const basePath = `/${locale}/dashboard`;
  const isDashboardHome = pathname === basePath || pathname === `${basePath}/`;
  const isOpeningHours = pathname?.includes('/opening-hours');
  const isClosings = pathname?.includes('/closings');
  const isMessages = pathname?.includes('/messages');

  const subPage = isOpeningHours
    ? t('openingHours')
    : isClosings
      ? t('closings')
      : isMessages
        ? t('messages')
        : null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className='hidden md:block'>
          {isDashboardHome ? (
            <BreadcrumbPage>{t('dashboard')}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={basePath}>{t('dashboard')}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {subPage && (
          <>
            <BreadcrumbSeparator className='hidden md:block' />
            <BreadcrumbItem>
              <BreadcrumbPage>{subPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

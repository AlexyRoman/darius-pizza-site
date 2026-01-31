'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, CalendarOff, MessageSquare, ChevronRight } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ModuleCardProps = {
  href: string | null;
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  comingSoon?: boolean;
};

function ModuleCard({
  href,
  icon,
  titleKey,
  descriptionKey,
  comingSoon = false,
}: ModuleCardProps) {
  const t = useTranslations();
  const title = t(titleKey);
  const description = t(descriptionKey);

  const cardContent = (
    <>
      <div className='flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary'>
        {icon}
      </div>
      <CardHeader className='p-0'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          {title}
          {!comingSoon && (
            <ChevronRight className='size-4 shrink-0 opacity-50' />
          )}
        </CardTitle>
        <CardDescription className='mt-1.5 line-clamp-2'>
          {description}
        </CardDescription>
      </CardHeader>
    </>
  );

  const baseClasses =
    'group relative flex h-full flex-col gap-4 transition-all hover:border-primary/50 hover:shadow-md';

  if (href && !comingSoon) {
    return (
      <Link href={href}>
        <Card className={`${baseClasses} cursor-pointer hover:bg-muted/30`}>
          <CardContent className='flex flex-col gap-4 pt-6'>
            {cardContent}
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card className={`${baseClasses} opacity-75`}>
      <CardContent className='flex flex-col gap-4 pt-6'>
        {cardContent}
        {comingSoon && (
          <span className='text-muted-foreground text-xs font-medium'>
            {t('dashboard.home.comingSoon')}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardHomeCards() {
  const t = useTranslations('dashboard.home');
  const locale = useLocale();

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold tracking-tight'>{t('welcome')}</h1>
        <p className='text-muted-foreground mt-1'>{t('subtitle')}</p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <ModuleCard
          href={`/${locale}/dashboard/opening-hours`}
          icon={<Clock className='size-6' />}
          titleKey='dashboard.home.modules.openingHours.title'
          descriptionKey='dashboard.home.modules.openingHours.description'
        />
        <ModuleCard
          href={`/${locale}/dashboard/closings`}
          icon={<CalendarOff className='size-6' />}
          titleKey='dashboard.home.modules.closings.title'
          descriptionKey='dashboard.home.modules.closings.description'
        />
        <ModuleCard
          href={`/${locale}/dashboard/messages`}
          icon={<MessageSquare className='size-6' />}
          titleKey='dashboard.home.modules.messages.title'
          descriptionKey='dashboard.home.modules.messages.description'
        />
      </div>
    </div>
  );
}

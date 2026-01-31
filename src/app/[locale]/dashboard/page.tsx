import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { OpeningHoursEditor } from '@/components/auth/OpeningHoursEditor';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DUMMY_STATS = {
  ordersToday: 24,
  pendingOrders: 5,
  revenue: '2 450',
  avgOrderValue: '42',
};

const DUMMY_ORDERS = [
  {
    id: '1234',
    customer: 'Jean Dupont',
    items: 2,
    total: '28',
    status: 'preparing',
  },
  {
    id: '1233',
    customer: 'Marie Martin',
    items: 1,
    total: '14',
    status: 'pending',
  },
  {
    id: '1232',
    customer: 'Pierre Bernard',
    items: 3,
    total: '45',
    status: 'completed',
  },
  {
    id: '1231',
    customer: 'Sophie Leroy',
    items: 2,
    total: '32',
    status: 'completed',
  },
  {
    id: '1230',
    customer: 'Luc Petit',
    items: 4,
    total: '58',
    status: 'preparing',
  },
];

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  const t = await getTranslations('dashboard');
  return {
    title: t('title'),
    description: t('subtitle'),
    robots: { index: false, follow: false },
  };
}

export default async function DashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dashboard');

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return t('table.statusPending');
      case 'completed':
        return t('table.statusCompleted');
      case 'preparing':
        return t('table.statusPreparing');
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'preparing':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <RouteGuard path='/dashboard' locale={locale}>
      <div className='container mx-auto max-w-5xl px-4 py-8'>
        <header className='mb-8'>
          <h1 className='text-3xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground mt-1'>{t('subtitle')}</p>
        </header>

        {/* Stats row */}
        <div className='mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>{t('stats.ordersToday')}</CardDescription>
              <CardTitle className='text-2xl'>
                {DUMMY_STATS.ordersToday}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>{t('stats.pendingOrders')}</CardDescription>
              <CardTitle className='text-2xl'>
                {DUMMY_STATS.pendingOrders}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>{t('stats.revenue')}</CardDescription>
              <CardTitle className='text-2xl'>€{DUMMY_STATS.revenue}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription>{t('stats.avgOrderValue')}</CardDescription>
              <CardTitle className='text-2xl'>
                €{DUMMY_STATS.avgOrderValue}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Welcome card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('cards.welcome.title')}</CardTitle>
              <CardDescription>
                {t('cards.welcome.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                {t('cards.welcome.content')}
              </p>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('cards.quickActions.title')}</CardTitle>
              <CardDescription>
                {t('cards.quickActions.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-wrap gap-2'>
              <Button variant='outline' size='sm'>
                {t('cards.quickActions.editMenu')}
              </Button>
              <Button variant='outline' size='sm'>
                {t('cards.quickActions.updateHours')}
              </Button>
              <Button variant='outline' size='sm'>
                {t('cards.quickActions.viewOrders')}
              </Button>
              <Button variant='outline' size='sm'>
                {t('cards.quickActions.manageStock')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Opening hours editor */}
        <div className='mt-6'>
          <OpeningHoursEditor />
        </div>

        {/* Recent orders table */}
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>{t('table.recentOrders')}</CardTitle>
            <CardDescription>
              {t('cards.recentActivity.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b text-left text-muted-foreground'>
                    <th className='pb-3 font-medium'>{t('table.orderId')}</th>
                    <th className='pb-3 font-medium'>{t('table.customer')}</th>
                    <th className='pb-3 font-medium'>{t('table.items')}</th>
                    <th className='pb-3 font-medium'>{t('table.total')}</th>
                    <th className='pb-3 font-medium'>{t('table.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {DUMMY_ORDERS.map(order => (
                    <tr key={order.id} className='border-b last:border-0'>
                      <td className='py-3 font-mono'>#{order.id}</td>
                      <td className='py-3'>{order.customer}</td>
                      <td className='py-3'>{order.items}</td>
                      <td className='py-3'>€{order.total}</td>
                      <td className='py-3'>
                        <Badge
                          variant={
                            getStatusVariant(order.status) as
                              | 'default'
                              | 'secondary'
                              | 'outline'
                          }
                        >
                          {getStatusLabel(order.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}

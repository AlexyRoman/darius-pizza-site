import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardBreadcrumb } from '@/components/dashboard/DashboardBreadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const DASHBOARD_LOCALES = ['fr', 'en'] as const;

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  if (
    !DASHBOARD_LOCALES.includes(locale as (typeof DASHBOARD_LOCALES)[number])
  ) {
    redirect('/en/dashboard');
  }

  setRequestLocale(locale);

  return (
    <RouteGuard path='/dashboard' locale={locale}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator
                orientation='vertical'
                className='mr-2 data-[orientation=vertical]:h-4'
              />
              <DashboardBreadcrumb />
            </div>
          </header>
          <div className='flex flex-1 flex-col min-h-0 gap-4 p-4 pt-0'>
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
}

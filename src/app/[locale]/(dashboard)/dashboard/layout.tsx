import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { RouteGuard } from '@/components/auth/RouteGuard';
import { AppSidebar } from '@/components/app-sidebar';
import { DashboardBreadcrumb } from '@/components/dashboard/DashboardBreadcrumb';
import { QueryProvider } from '@/components/providers/QueryProvider';
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
      <QueryProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className='relative flex h-16 shrink-0 items-center gap-2 pt-5 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:pt-0 md:bg-transparent md:pl-6'>
              {/* Mobile: fixed circular trigger (phone CTA style) */}
              <div className='fixed left-4 top-5 z-50 md:static md:left-auto md:top-auto md:ml-2'>
                <SidebarTrigger
                  className='h-12 w-12 rounded-full !bg-primary !text-primary-foreground shadow-lg hover:!bg-primary/90 active:!bg-primary md:h-7 md:w-7 md:rounded-md md:border md:border-sidebar-border md:!bg-sidebar-accent/60 md:!text-sidebar-foreground md:hover:!bg-sidebar-accent md:hover:!text-sidebar-accent-foreground'
                  aria-label='Toggle sidebar'
                />
              </div>
              <div className='flex min-w-0 flex-1 items-center gap-2 px-4 pl-[5.5rem] md:pl-4'>
                <Separator
                  orientation='vertical'
                  className='mr-2 hidden data-[orientation=vertical]:h-4 md:block'
                />
                <DashboardBreadcrumb />
              </div>
            </header>
            <div className='flex flex-1 flex-col min-h-0 gap-4 p-4 pt-2 md:pt-0'>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </QueryProvider>
    </RouteGuard>
  );
}

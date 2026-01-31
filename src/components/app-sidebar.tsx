'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  ChevronRight,
  Clock,
  LayoutDashboard,
  Globe,
  Store,
  CalendarOff,
  MessageSquare,
  Settings,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/header/ThemeToggle';
import { DashboardLocaleToggle } from '@/components/dashboard/DashboardLocaleToggle';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('dashboard.sidebar');
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'fr';
  const basePath = `/${locale}/dashboard`;
  const isDashboardHome = pathname === basePath || pathname === `${basePath}/`;
  const isOpeningHours = pathname?.includes('/opening-hours');
  const isClosings = pathname?.includes('/closings');
  const isMessages = pathname?.includes('/messages');

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div
          className='flex items-center justify-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2.5 shadow-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2'
          data-sidebar='brand'
        >
          <Store className='size-5 shrink-0 text-sidebar-foreground group-data-[collapsible=icon]:size-5' />
          <span className='font-semibold text-sidebar-foreground truncate group-data-[collapsible=icon]:hidden'>
            {t('title')}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isDashboardHome}
                tooltip={t('home')}
              >
                <Link href={basePath}>
                  <LayoutDashboard className='size-4' />
                  <span>{t('home')}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible
              asChild
              defaultOpen={isOpeningHours || isClosings || isMessages}
              className='group/collapsible'
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={t('settings')}
                    isActive={isOpeningHours || isClosings || isMessages}
                  >
                    <Settings className='size-4' />
                    <span>{t('settings')}</span>
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isOpeningHours}>
                        <Link href={`${basePath}/opening-hours`}>
                          <Clock className='size-4' />
                          <span>{t('openingHours')}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isClosings}>
                        <Link href={`${basePath}/closings`}>
                          <CalendarOff className='size-4' />
                          <span>{t('closings')}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isMessages}>
                        <Link href={`${basePath}/messages`}>
                          <MessageSquare className='size-4' />
                          <span>{t('messages')}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className='flex flex-col gap-2 p-2'>
          <Link
            href={`/${locale}`}
            className='flex items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center'
          >
            <Globe className='size-4 shrink-0' />
            <span className='truncate group-data-[collapsible=icon]:hidden'>
              {t('goBackToWebsite')}
            </span>
          </Link>
          <div className='flex flex-col gap-2 group-data-[collapsible=icon]:items-center sm:flex-row sm:items-center sm:justify-between'>
            <ThemeToggle />
            <DashboardLocaleToggle />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

import { Suspense } from 'react';
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { GuildSwitcher } from './guild-switcher';
import { SidebarNavigation } from './sidebar-navigation';

type AppSidebarProps = {
  guildId: string;
};

export function AppSidebar({ guildId }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className='px-3 pt-3'>
        <Suspense fallback={<Skeleton className='h-12' />}>
          <GuildSwitcher currentGuildId={guildId} />
        </Suspense>
      </SidebarHeader>
      <SidebarContent className='px-3'>
        <SidebarNavigation />
      </SidebarContent>
    </Sidebar>
  );
}

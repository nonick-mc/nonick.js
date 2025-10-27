import { BookOpenIcon, LifeBuoyIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Links } from '@/lib/constants';
import { GuildSwitcher } from './guild-switcher';
import { SidebarNavigation } from './sidebar-navigation';

type AppSidebarProps = {
  guildId: string;
};

export function AppSidebar({ guildId }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className='px-3 pt-0'>
        <div className='h-16 px-2 flex items-center'>
          <Link href='/'>
            <Logo height={17} />
          </Link>
        </div>
        <div className='px-2'>
          <Suspense fallback={<Skeleton className='h-12' />}>
            <GuildSwitcher currentGuildId={guildId} />
          </Suspense>
        </div>
      </SidebarHeader>
      <SidebarContent className='px-3'>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter className='px-3'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={Links.Docs} target='_blank'>
                    <BookOpenIcon className='text-muted-foreground' />
                    ドキュメント
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={Links.SupportServer} target='_blank'>
                    <LifeBuoyIcon className='text-muted-foreground' />
                    サポートサーバー
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}

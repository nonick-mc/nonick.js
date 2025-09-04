import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/logo';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { getGuild, getMutualManagedGuilds, inviteUrl } from '@/lib/discord/api';
import { GuildSwitcher } from './guild-switcher';
import { SidebarNavigation } from './sidebar-navigation';
import { UserDropdown } from './user-dropdown';

export function DashboardSidebar({ guildId }: { guildId: string }) {
  const guildPromise = getGuild(guildId);
  const otherGuildsPromise = getMutualManagedGuilds().then((guilds) =>
    guilds.filter((guild) => guild.id !== guildId),
  );

  return (
    <Sidebar variant='inset'>
      <SidebarHeader className='gap-4'>
        <Link href='/' className='p-2'>
          <Logo height={16} />
        </Link>
        <Suspense fallback={<Skeleton className='h-12' />}>
          <GuildSwitcher
            guildPromise={guildPromise}
            otherGuildsPromise={otherGuildsPromise}
            inviteUrl={inviteUrl}
          />
        </Suspense>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
}

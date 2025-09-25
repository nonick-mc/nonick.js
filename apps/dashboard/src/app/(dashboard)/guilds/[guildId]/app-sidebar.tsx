import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/logo';
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { getGuild, getMutualManagedGuilds, inviteUrl } from '@/lib/discord/api';
import { GuildSwitcher } from './guild-switcher';
import { SidebarNavigation } from './sidebar-navigation';

export function AppSidebar({ guildId }: { guildId: string }) {
  const guildPromise = getGuild(guildId);
  const otherGuildsPromise = getMutualManagedGuilds().then((guilds) =>
    guilds.filter((guild) => guild.id !== guildId),
  );

  return (
    <Sidebar>
      <SidebarHeader className='px-6 h-16 flex-row items-center'>
        <Link className='pt-4' href='/'>
          <Logo height={16} />
        </Link>
      </SidebarHeader>
      <SidebarContent className='px-6 pt-4 gap-4'>
        <Suspense fallback={<Skeleton className='h-12' />}>
          <GuildSwitcher
            guildPromise={guildPromise}
            otherGuildsPromise={otherGuildsPromise}
            inviteUrl={inviteUrl}
          />
        </Suspense>
        <SidebarNavigation />
      </SidebarContent>
    </Sidebar>
  );
}

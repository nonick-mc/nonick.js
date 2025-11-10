import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@repo/ui/components/sidebar';
import { Skeleton } from '@repo/ui/components/skeleton';
import { ChevronsUpDown, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { getGuild, getMutualManagedGuilds } from '@/lib/discord/api';
import { DiscordEndPoints, inviteBotUrl } from '@/lib/discord/constants';

type GuildSwitcherProps = {
  currentGuildId: string;
};

export async function GuildSwitcher({ currentGuildId }: GuildSwitcherProps) {
  const currentGuild = await getGuild(currentGuildId);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border'
            >
              <Avatar className='size-8 rounded-lg'>
                <AvatarImage
                  src={`${DiscordEndPoints.CDN}/icons/${currentGuild.id}/${currentGuild.icon}`}
                />
                <AvatarFallback>{currentGuild.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span>{currentGuild.name}</span>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width)'
            align='center'
            side='bottom'
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className='text-xs'>サーバー</DropdownMenuLabel>
              <DropdownMenuCheckboxItem checked>
                <Avatar className='size-6'>
                  <AvatarImage
                    src={`${DiscordEndPoints.CDN}/icons/${currentGuild.id}/${currentGuild.icon}`}
                  />
                  <AvatarFallback>{currentGuild.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{currentGuild.name}</span>
              </DropdownMenuCheckboxItem>
              <Suspense fallback={<GuildsMenuFallback />}>
                <GuildsMenu currentGuildId={currentGuildId} />
              </Suspense>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={inviteBotUrl}>
                <PlusIcon />
                サーバーを追加
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function GuildsMenuFallback() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton
        <DropdownMenuCheckboxItem key={index}>
          <Skeleton className='size-6 rounded-full' />
          <Skeleton className='flex-1 h-4' />
        </DropdownMenuCheckboxItem>
      ))}
    </>
  );
}

async function GuildsMenu({ currentGuildId }: { currentGuildId: string }) {
  const guilds = await getMutualManagedGuilds();

  return (
    <>
      {guilds
        .filter((guild) => guild.id !== currentGuildId)
        .map((v) => (
          <DropdownMenuItem key={v.id} asChild>
            <Link href={`/guilds/${v.id}`}>
              <Avatar className='size-6'>
                <AvatarImage src={`${DiscordEndPoints.CDN}/icons/${v.id}/${v.icon}`} />
                <AvatarFallback>{v.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span>{v.name}</span>
            </Link>
          </DropdownMenuItem>
        ))}
    </>
  );
}

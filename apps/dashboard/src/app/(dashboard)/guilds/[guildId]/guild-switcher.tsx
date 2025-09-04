'use client';

import { ChevronsUpDownIcon, CirclePlusIcon } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import type { getGuild, getMutualManagedGuilds, inviteUrl } from '@/lib/discord/api';
import { DiscordEndPoints } from '@/lib/discord/constants';

type GuildSwitcherProps = {
  guildPromise: ReturnType<typeof getGuild>;
  otherGuildsPromise: ReturnType<typeof getMutualManagedGuilds>;
  inviteUrl: typeof inviteUrl;
};

export function GuildSwitcher({ guildPromise, otherGuildsPromise, inviteUrl }: GuildSwitcherProps) {
  const currentGuild = use(guildPromise);
  const otherGuilds = use(otherGuildsPromise);
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <Avatar className='size-8 rounded-md'>
            <AvatarImage
              src={
                currentGuild.icon
                  ? `${DiscordEndPoints.CDN}/icons/${currentGuild.id}/${currentGuild.icon}`
                  : undefined
              }
            />
            <AvatarFallback>{currentGuild.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className='flex-1 text-left min-w-0'>
            <span className='truncate font-medium'>{currentGuild.name}</span>
          </div>
          <ChevronsUpDownIcon className='ml-auto' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={isMobile ? 'bottom' : 'right'}
        align={isMobile ? 'center' : 'start'}
        className='w-64'
      >
        {otherGuilds.length !== 0 && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className='text-muted-foreground text-xs'>
                サーバー
              </DropdownMenuLabel>
              {otherGuilds.map((guild) => (
                <DropdownMenuItem key={guild.id} className='p-2 gap-2' asChild>
                  <Link href={`/guilds/${guild.id}`}>
                    <Avatar className='shrink-0 size-6 rounded-md'>
                      <AvatarImage
                        src={
                          guild.icon
                            ? `${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}`
                            : undefined
                        }
                      />
                      <AvatarFallback>{guild.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1 text-left min-w-0'>
                      <span className='truncate block'>{guild.name}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem className='p-2 gap-2' asChild>
            <Link href={inviteUrl}>
              <div className='size-6 flex items-center justify-center'>
                <CirclePlusIcon />
              </div>

              <p>サーバーを追加</p>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { ChevronsUpDown, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
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
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { getMutualManagedGuilds } from '@/lib/discord/api';
import { DiscordEndPoints, inviteBotUrl } from '@/lib/discord/constants';

type GuildSwitcherProps = {
  currentGuildId: string;
};

export async function GuildSwitcher({ currentGuildId }: GuildSwitcherProps) {
  const guilds = await getMutualManagedGuilds();
  const currentGuild = guilds.find((guild) => guild.id === currentGuildId);
  if (!currentGuild) redirect('/');

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
            {guilds.length && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className='text-xs'>サーバー</DropdownMenuLabel>
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
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
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

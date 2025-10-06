import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DiscordEndPoints } from '@/lib/discord/constants';

type GuildCardProps = {
  guild: RESTAPIPartialCurrentUserGuild;
};

export function GuildCard({ guild }: GuildCardProps) {
  return (
    <Link href={`/guilds/${guild.id}`}>
      <Card className='overflow-hidden flex flex-col justify-center p-6 gap-5 hover:border-zinc-700'>
        <Avatar className='size-20 mx-auto'>
          <AvatarImage
            className='bg-muted'
            src={guild.icon ? `${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}` : undefined}
          />
          <AvatarFallback className='text-lg'>{guild.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span className='text-center truncate'>{guild.name}</span>
      </Card>
    </Link>
  );
}

export function GuildCardSkeleton() {
  return (
    <Card className='overflow-hidden flex flex-col justify-center p-6 gap-5'>
      <Skeleton className='size-20 rounded-full mx-auto' />
      <Skeleton className='h-6 w-1/2 mx-auto' />
    </Card>
  );
}

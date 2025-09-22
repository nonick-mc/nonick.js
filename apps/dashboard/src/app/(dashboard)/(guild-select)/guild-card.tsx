import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DiscordEndPoints } from '@/lib/discord/constants';

export function GuildCard({ guild }: { guild: RESTAPIPartialCurrentUserGuild }) {
  return (
    <Link href={`/guilds/${guild.id}`}>
      <Card className='overflow-hidden py-0 gap-0 flex flex-col w-full transition-colors hover:border-zinc-700'>
        <div className='py-6 mx-auto'>
          <Avatar className='size-20'>
            <AvatarImage
              className='bg-muted'
              src={
                guild.icon ? `${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}` : undefined
              }
            />
            <AvatarFallback className='text-lg'>{guild.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
        <div className='p-3 border-t'>
          <p className='w-full text-center truncate'>{guild.name}</p>
        </div>
      </Card>
    </Link>
  );
}

export function GuildCardSkeleton() {
  return (
    <Card className='overflow-hidden flex flex-col w-full py-0 gap-0'>
      <div className='py-6 mx-auto'>
        <Skeleton className='size-20 rounded-full' />
      </div>
      <div className='w-full p-3 mx-auto border-t h-'>
        <Skeleton className='max-w-[200px] h-[24px] mx-auto' />
      </div>
    </Card>
  );
}

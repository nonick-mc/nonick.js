import { DiscordEndPoints } from '@/lib/discord/constants';
import { truncateString } from '@/lib/utils';
import { Avatar } from '@heroui/avatar';
import { Card, type CardProps } from '@heroui/card';
import { Link } from '@heroui/link';
import { Skeleton } from '@heroui/skeleton';
import { cn } from '@heroui/theme';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';

export function GuildCard({ guild }: { guild: RESTAPIPartialCurrentUserGuild }) {
  return (
    <Card
      as={Link}
      href={`/guilds/${guild.id}`}
      className='col-span-12 sm:col-span-6 lg:col-span-3 overflow-hidden h-full hover:opacity-100 active:opacity-100'
      fullWidth
      isPressable
    >
      <div className='w-full flex items-center justify-center h-28'>
        <Avatar
          name={truncateString(guild.name, 15)}
          src={guild.icon ? `${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}` : undefined}
          classNames={{
            base: 'w-[70px] h-[70px]',
            name: 'text-sm text-nowrap',
          }}
          alt={`${guild.name}のサーバーアイコン`}
          showFallback
        />
      </div>
      <div className='w-full min-h-12 flex flex-1 justify-center items-center p-3 bg-content2 line-clamp-2'>
        <p>{truncateString(guild.name, 15)}</p>
      </div>
    </Card>
  );
}

export function GuildCardSkeleton({ className, fullWidth = true, ...props }: CardProps) {
  return (
    <Card
      className={cn('col-span-12 sm:col-span-6 lg:col-span-3 overflow-hidden h-full', className)}
      fullWidth={fullWidth}
      {...props}
    >
      <div className='w-full flex items-center justify-center h-28'>
        <Skeleton className='w-[70px] h-[70px] rounded-full' />
      </div>
      <div className='w-full flex flex-1 justify-center items-center'>
        <Skeleton className='w-full h-12' />
      </div>
    </Card>
  );
}

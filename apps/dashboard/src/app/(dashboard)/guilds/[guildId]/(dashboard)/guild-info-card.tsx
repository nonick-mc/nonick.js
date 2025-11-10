import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@repo/ui/components/item';
import { Skeleton } from '@repo/ui/components/skeleton';
import { GuildFeature } from 'discord-api-types/v10';
import { BadgeCheckIcon } from 'lucide-react';
import { getGuild } from '@/lib/discord/api';
import { DiscordEndPoints } from '@/lib/discord/constants';
import { GuildInfoCardAction } from './guild-info-card-action';

export async function GuildInfoCard({ guildId }: { guildId: string }) {
  const guild = await getGuild(guildId, true);
  const features = guild.features;

  const getGuildStatus = () => {
    if (features.includes(GuildFeature.Verified)) {
      return (
        <ItemDescription className='flex items-center gap-1'>
          <BadgeCheckIcon className='size-5 text-green-600' />
          認証済みサーバー
        </ItemDescription>
      );
    }
    if (features.includes(GuildFeature.Partnered)) {
      return (
        <ItemDescription className='flex items-center gap-1'>
          <BadgeCheckIcon className='size-5 text-blue-600' />
          パートナーサーバー
        </ItemDescription>
      );
    }
    if (features.includes(GuildFeature.Community))
      return <ItemDescription>コミュニティサーバー</ItemDescription>;
  };

  return (
    <Item variant='outline'>
      <ItemMedia>
        <Avatar className='size-10'>
          <AvatarImage src={`${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}`} />
          <AvatarFallback>{guild.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{guild.name}</ItemTitle>
        {getGuildStatus()}
      </ItemContent>
      <ItemActions>
        <GuildInfoCardAction />
      </ItemActions>
    </Item>
  );
}

export function GuildInfoCardSkeleton() {
  return (
    <Item variant='outline'>
      <ItemMedia>
        <Skeleton className='size-10 rounded-full' />
      </ItemMedia>
      <ItemContent>
        <Skeleton className='h-5 w-1/2' />
        <Skeleton className='h-4 w-1/4' />
      </ItemContent>
      <ItemActions>
        <Skeleton className='size-9' />
      </ItemActions>
    </Item>
  );
}

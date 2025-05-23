import { DiscordEndPoints } from '@/lib/discord/constants';
import { Avatar } from '@heroui/avatar';
import { Card } from '@heroui/card';
import { Snippet } from '@heroui/snippet';
import { type APIGuild, GuildFeature } from 'discord-api-types/v10';
import { createElement } from 'react';
import { PartneredBadge, VerifiedBadge } from './badge';

export async function GuildCard({ guild }: { guild: APIGuild }) {
  const badge = getGuildBadge(guild);

  return (
    <Card className='p-6 flex flex-col gap-4'>
      <div className='flex max-md:flex-col max-md:items-start justify-between items-center gap-4'>
        <div className='flex gap-4 items-center'>
          <Avatar
            size='lg'
            name={guild.name}
            src={
              guild.icon
                ? `${DiscordEndPoints.CDN}/icons/${guild.id}/${guild.icon}.webp`
                : undefined
            }
            showFallback
            isBordered
          />
          <div className='flex flex-col flex-1'>
            <div className='flex gap-2 items-center'>
              <p className='font-extrabold text-xl line-clamp-2'>{guild.name}</p>
              {badge?.icon && createElement(badge.icon, { className: 'text-white shrink-0' })}
            </div>
            {badge?.text && <p className='text-default-500 text-sm'>{badge.text}</p>}
          </div>
        </div>
        <Snippet
          classNames={{ base: 'max-md:w-full', symbol: 'text-default-500' }}
          symbol='サーバーID:'
        >
          {guild.id}
        </Snippet>
      </div>
    </Card>
  );
}

function getGuildBadge(guild: APIGuild) {
  const features = guild.features;
  if (features.includes(GuildFeature.Verified))
    return { text: '認証済みサーバー', icon: VerifiedBadge };
  if (features.includes(GuildFeature.Partnered))
    return { text: 'Discordパートナーサーバー', icon: PartneredBadge };
  if (features.includes(GuildFeature.Community)) return { text: 'コミュニティサーバー' };
  return null;
}

import { Icon } from '@/components/icon';
import { getGuild } from '@/lib/discord/api';
import { DiscordEndPoints } from '@/lib/discord/constants';
import { Avatar } from '@heroui/avatar';
import { Card, type CardProps } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Snippet } from '@heroui/snippet';
import { cn } from '@heroui/theme';
import { type APIGuild, GuildFeature } from 'discord-api-types/v10';
import { type Snowflake, getDate } from 'discord-snowflake';
import { createElement } from 'react';
import { PartneredBadge, VerifiedBadge } from './badge';

export async function GuildStatsCard({ guildId }: { guildId: string }) {
  const guild = await getGuild(guildId, true);

  const createAt = getDate(guild.id as Snowflake);
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
      <Divider className='my-2' />
      <div className='grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-3 gap-4'>
        <StatsCard
          label='メンバー数'
          value={(guild.approximate_member_count || 0).toLocaleString()}
          icon='solar:users-group-rounded-bold'
        />
        <StatsCard
          label='サーバーブースト数'
          value={(guild.premium_subscription_count || 0).toLocaleString()}
          icon='solar:stars-minimalistic-bold'
        />
        <StatsCard
          className='max-sm:col-span-1 max-md:col-span-2'
          label='サーバー作成日'
          value={`${createAt.getFullYear()}年${createAt.getMonth() + 1}月${createAt.getDate()}日`}
          icon='solar:calendar-mark-bold'
        />
      </div>
    </Card>
  );
}

type StatsCardProps = { label: string; icon: string; value: string } & CardProps;

export function StatsCard({ label, icon, value, className, ...props }: StatsCardProps) {
  return (
    <Card className={cn('flex flex-col gap-2 p-6 bg-content2 shadow-none', className)} {...props}>
      <div className='flex items-center justify-between select-none text-default-500'>
        <p className='text-sm'>{label}</p>
        <Icon icon={icon} className='text-2xl' />
      </div>
      <p className='text-2xl font-black'>{value}</p>
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

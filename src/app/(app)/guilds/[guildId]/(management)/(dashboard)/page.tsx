import { Links } from '@/lib/constants';
import { getGuild } from '@/lib/discord/api';
import { requireDashboardAccessPermission } from '@/lib/permission';
import { Alert } from '@heroui/alert';
import { Link } from '@heroui/link';
import { type Snowflake, getDate } from 'discord-snowflake';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { GuildCard } from './guild-card';
import { StatsCard } from './stats-card';

export const metadata: Metadata = {
  title: 'ダッシュボード',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const guild = await getGuild(guildId, true);
  const createAt = getDate(guild.id as Snowflake);

  return (
    <>
      <GuildCard guild={guild} />
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
      <Alert
        variant='faded'
        color='primary'
        title='今後のアップデートで閲覧できる項目を拡張予定！'
        description={
          <span>
            アップデート後、メンバー数やメッセージ数の増減をこのページで確認できるようになります。
            <Link size='sm' href={Links.Discord} isExternal showAnchorIcon>
              サポートサーバー
            </Link>
            で追加してほしい統計を募集しています。
          </span>
        }
      />
    </>
  );
}

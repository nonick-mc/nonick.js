import { getDate, type Snowflake } from 'discord-snowflake';
import { CalendarIcon, InfoIcon, RocketIcon, UsersIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getGuild } from '@/lib/discord/api';
import { validateDashboardAccessPermission } from '@/lib/permission';
import { StatsCard } from './stats-card';

export const metadata: Metadata = {
  title: 'ダッシュボード',
};

export default async function Page({ params }: PageProps<'/guilds/[guildId]'>) {
  const { guildId } = await params;
  await validateDashboardAccessPermission(guildId);

  const guild = await getGuild(guildId, true);
  const createAt = getDate(guild.id as Snowflake);

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <StatsCard
          label='メンバー数'
          value={(guild.approximate_member_count || 0).toLocaleString()}
          icon={UsersIcon}
        />
        <StatsCard
          label='サーバーブースト数'
          value={(guild.premium_subscription_count || 0).toLocaleString()}
          icon={RocketIcon}
        />
        <StatsCard
          className='max-sm:col-span-1 max-md:col-span-2'
          label='サーバー作成日'
          value={`${createAt.getFullYear()}年${createAt.getMonth() + 1}月${createAt.getDate()}日`}
          icon={CalendarIcon}
        />
      </div>
      <Alert>
        <InfoIcon />
        <AlertTitle>今後のアップデートで閲覧できる項目を拡張予定！</AlertTitle>
        <AlertDescription>
          アップデート後、メンバー数やメッセージ数の増減をこのページで確認できるようになります。
        </AlertDescription>
      </Alert>
    </>
  );
}

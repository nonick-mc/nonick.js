import { requireDashboardAccessPermission } from '@/lib/permission';
import { Alert } from '@heroui/alert';
import { Code } from '@heroui/code';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { GuildStatsCard } from './guild-stats-card';

export const metadata: Metadata = {
  title: 'ダッシュボード',
};

export default async function Page({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  return (
    <>
      <GuildStatsCard guildId={guildId} />
      <Alert
        variant='faded'
        color='primary'
        title={
          <span>
            <Code>v5.2</Code>{' '}
            から、メンバー数やメッセージ数の増減をこのページで確認できるようになります。
          </span>
        }
      />
    </>
  );
}

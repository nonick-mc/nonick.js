import { Alert, AlertTitle } from '@/components/ui/alert';
import { hasAccessDashboardPermission } from '@/lib/discord';
import { Code } from '@nextui-org/code';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { GuildInfoCard } from './guild-card';

export const metadata: Metadata = {
  title: 'ダッシュボード',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  return (
    <>
      <GuildInfoCard guildId={guildId} />
      <Alert variant='info'>
        <AlertTitle>
          <Code>v5.2</Code>
          から、メンバー数やメッセージ数の増減をこのページで確認できるようになります。
        </AlertTitle>
      </Alert>
    </>
  );
}

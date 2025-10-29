import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { getChannels, getRoles } from '@/lib/discord/api';
import { sortChannels, sortRoles } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { CreateRuleDialog } from './_dialogs/create-rule-dialog';
import { RulesMaxSize } from './constants';
import { RuleList } from './rule-list';

export const metadata: Metadata = {
  title: '自動スレッド作成',
};

export default async function Page({ params }: PageProps<'/guilds/[guildId]/auto-create-thread'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const [channels, roles, rules] = await Promise.all([
    getChannels(guildId),
    getRoles(guildId),
    db.query.autoCreateThreadRule.findMany({
      where: (rule, { eq }) => eq(rule.guildId, guildId),
      orderBy: (rule, { asc }) => asc(rule.createdAt),
    }),
  ]);

  const sortedChannels = sortChannels(channels);
  const sortedRoles = sortRoles(roles);

  return (
    <>
      <Header
        title='自動スレッド作成'
        description='指定したチャンネルにメッセージが投稿された際、自動でスレッドを作成します。'
      />
      <Card>
        <CardHeader className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='w-full flex flex-col gap-1.5'>
            <CardTitle>チャンネル一覧</CardTitle>
            <CardDescription>
              最大10個のチャンネルを追加できます。（残り{RulesMaxSize - rules.length}個）
            </CardDescription>
          </div>
          <CreateRuleDialog channels={sortedChannels} roles={sortedRoles} rules={rules} />
        </CardHeader>
        <CardContent>
          <RuleList channels={sortedChannels} roles={sortedRoles} rules={rules} />
        </CardContent>
      </Card>
    </>
  );
}

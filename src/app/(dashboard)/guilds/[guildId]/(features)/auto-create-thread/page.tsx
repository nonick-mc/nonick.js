import { Header, HeaderDescription, HeaderTitle } from '@/components/header';
import { AutoCreateThreadConfig as model } from '@/lib/database/models';
import { AutoCreateThreadConfig as schema } from '@/lib/database/zod';
import { getChannels, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ConfigForm } from './form';

export const metadata: Metadata = {
  title: '自動スレッド作成',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, config] = await Promise.all([getChannels(guildId), model.findOne({ guildId })]);

  return (
    <>
      <Header>
        <HeaderTitle>自動スレッド作成</HeaderTitle>
        <HeaderDescription>
          指定したチャンネルにメッセージが投稿された際、自動でスレッドを作成します。
        </HeaderDescription>
      </Header>
      <ConfigForm channels={channels} config={schema.safeParse(config).data ?? null} />
    </>
  );
}

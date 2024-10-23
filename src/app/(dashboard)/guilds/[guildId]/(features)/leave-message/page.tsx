import { Header, HeaderDescription, HeaderTitle } from '@/components/header';
import { LeaveMessageConfig as model } from '@/lib/database/models';
import { LeaveMessageConfig as schema } from '@/lib/database/zod';
import { getChannels, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ConfigForm } from './form';

export const metadata: Metadata = {
  title: '退室メッセージ',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, config] = await Promise.all([getChannels(guildId), model.findOne({ guildId })]);

  return (
    <>
      <Header>
        <HeaderTitle>退室メッセージ</HeaderTitle>
        <HeaderDescription>
          サーバーからユーザーが退室した際にメッセージを送信します。
        </HeaderDescription>
      </Header>
      <ConfigForm channels={channels} config={schema.safeParse(config).data ?? null} />
    </>
  );
}

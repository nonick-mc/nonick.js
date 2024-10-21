import { Header, HeaderDescription, HeaderTitle } from '@/components/header';
import { MessageExpandConfig as model } from '@/lib/database/models';
import { MessageExpandConfig as schema } from '@/lib/database/zod';
import { getChannels, getGuild, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ConfigForm } from './form';

export const metadata: Metadata = {
  title: 'メッセージURL展開',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, config] = await Promise.all([getChannels(guildId), model.findOne({ guildId })]);

  return (
    <>
      <Header>
        <HeaderTitle>メッセージURL展開</HeaderTitle>
        <HeaderDescription>
          DiscordのメッセージURLが送信された際に、そのメッセージの内容を追加で送信します。
        </HeaderDescription>
      </Header>
      <ConfigForm channels={channels} config={schema.safeParse(config).data ?? null} />
    </>
  );
}

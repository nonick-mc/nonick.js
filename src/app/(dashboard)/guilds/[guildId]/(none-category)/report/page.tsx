import { Header, HeaderDescription, HeaderTitle } from '@/components/header';
import { ReportConfig as model } from '@/lib/database/models';
import { ReportConfig as schema } from '@/lib/database/zod';
import { getChannels, getRoles, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ConfigForm } from './form';

export const metadata: Metadata = {
  title: 'サーバー内通報',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const channels = await getChannels(guildId);
  const roles = await getRoles(guildId);
  const config = await model.findOne({ guildId });

  return (
    <>
      <Header>
        <HeaderTitle>サーバー内通報</HeaderTitle>
        <HeaderDescription>
          不適切なメッセージやユーザーをメンバーが通報できるようにします。
        </HeaderDescription>
      </Header>
      <ConfigForm
        channels={channels}
        roles={roles}
        config={schema.safeParse(config).data ?? null}
      />
    </>
  );
}

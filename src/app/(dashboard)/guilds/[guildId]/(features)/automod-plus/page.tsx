import { Header, HeaderDescription, HeaderTitle } from '@/components/header';
import { AutoModConfig as model } from '@/lib/database/models';
import { AutoModConfig as schema } from '@/lib/database/zod';
import { getChannels, getRoles, hasAccessDashboardPermission } from '@/lib/discord';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ConfigForm } from './form';

// TODO: ブロックするドメインのスキーマミス修正

export const metadata: Metadata = {
  title: 'AutoMod Plus',
};

export default async function Page({ params: { guildId } }: { params: { guildId: string } }) {
  if (!(await hasAccessDashboardPermission(guildId))) redirect('/');

  const [channels, roles, config] = await Promise.all([
    getChannels(guildId),
    getRoles(guildId),
    model.findOne({ guildId }),
  ]);

  return (
    <>
      <Header>
        <HeaderTitle>AutoMod Plus</HeaderTitle>
        <HeaderDescription>特定の条件を満たすメッセージを自動で削除します。</HeaderDescription>
      </Header>
      <ConfigForm
        channels={channels}
        roles={roles}
        config={schema.safeParse(config).data ?? null}
      />
    </>
  );
}

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { InfoIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { getChannels, getRoles } from '@/lib/discord/api';
import { sortChannels, sortRoles } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { SettingForm } from './form';
import { formSchema } from './schema';

export const metadata: Metadata = {
  title: 'サーバー内通報',
};

export default async function Page({ params }: PageProps<'/guilds/[guildId]/report'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const [channels, roles, setting] = await Promise.all([
    getChannels(guildId),
    getRoles(guildId),
    db.query.reportSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header
        title='サーバー内通報'
        description='不適切なメッセージやユーザーをメンバーが通報できるようにします。'
      />
      <Alert variant='primary'>
        <InfoIcon />
        <AlertTitle>この機能はデフォルトで有効になっています。</AlertTitle>
        <AlertDescription>
          この機能を無効にするには、Discordサーバーの「サーバー設定」→「連携サービス」から、コマンドを無効化する必要があります。
        </AlertDescription>
      </Alert>
      <SettingForm
        channels={sortChannels(channels)}
        roles={sortRoles(roles)}
        setting={formSchema.safeParse(setting).data}
      />
    </>
  );
}

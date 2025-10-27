import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { SettingForm } from './form';
import { formSchema } from './schema';

export const metadata: Metadata = {
  title: '入室メッセージ',
};

export default async function Page({ params }: PageProps<'/guilds/[guildId]/join-message'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    db.query.joinMessageSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header
        title='入室メッセージ'
        description='サーバーにユーザーが参加した際にメッセージを送信します。'
      />
      <SettingForm channels={sortChannels(channels)} setting={formSchema.safeParse(setting).data} />
    </>
  );
}

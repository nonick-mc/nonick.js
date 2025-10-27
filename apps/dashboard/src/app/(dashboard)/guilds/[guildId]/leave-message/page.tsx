import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { SettingForm } from './form';
import { formSchema } from './schema';

export const metadata: Metadata = {
  title: '退室時メッセージ',
};

export default async function Page({ params }: PageProps<'/guilds/[guildId]/leave-message'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    db.query.leaveMessageSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header
        title='退室メッセージ'
        description='サーバーからユーザーが退室した際にメッセージを送信します。'
      />
      <SettingForm channels={sortChannels(channels)} setting={formSchema.safeParse(setting).data} />
    </>
  );
}

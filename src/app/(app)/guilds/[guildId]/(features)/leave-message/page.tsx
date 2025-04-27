import { Header } from '@/components/header';
import { leaveMessageSettingSchema } from '@/lib/database/src/schema/setting';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: '退室メッセージ',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

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
      <SettingForm
        channels={sortChannels(channels)}
        setting={leaveMessageSettingSchema.form.safeParse(setting).data ?? null}
      />
    </>
  );
}

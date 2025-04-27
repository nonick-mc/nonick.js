import { Header } from '@/components/header';
import { msgExpandSettingSchema } from '@/lib/database/src/schema/setting';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: 'メッセージURL展開',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    db.query.msgExpandSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header
        title='メッセージURL展開'
        description='DiscordのメッセージURLが送信された際に、そのメッセージの内容を追加で送信します。'
      />
      <SettingForm
        channels={sortChannels(channels)}
        setting={msgExpandSettingSchema.form.safeParse(setting).data ?? null}
      />
    </>
  );
}

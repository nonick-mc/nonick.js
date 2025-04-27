import { Header } from '@/components/header';
import { autoCreateThreadSettingSchema } from '@/lib/database/src/schema/setting';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: '自動スレッド公開',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    db.query.autoCreateThreadSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header
        title='自動スレッド公開'
        description='指定したチャンネルにメッセージが投稿された際、自動でスレッドを作成します。'
      />
      <SettingForm
        channels={sortChannels(channels)}
        setting={autoCreateThreadSettingSchema.form.safeParse(setting).data ?? null}
      />
    </>
  );
}

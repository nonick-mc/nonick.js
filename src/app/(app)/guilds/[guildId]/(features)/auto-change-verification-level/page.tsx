import { Header } from '@/components/header';
import { autoChangeVerifyLevelSettingSchema } from '@/lib/database/src/schema/setting';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';

export const metadata: Metadata = {
  title: '自動認証レベル変更',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    db.query.autoChangeVerifyLevelSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header
        title='自動認証レベル変更'
        description='サーバーの認証レベルを特定の時間帯だけ変更します。'
      />
      <SettingForm
        channels={sortChannels(channels)}
        setting={autoChangeVerifyLevelSettingSchema.form.safeParse(setting).data ?? null}
      />
    </>
  );
}

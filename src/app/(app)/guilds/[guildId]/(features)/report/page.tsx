import { Header } from '@/components/header';
import { getChannels, getRoles } from '@/lib/discord/api';
import { sortChannels, sortRoles } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';
import { reportSettingFormSchema } from './schema';

export const metadata: Metadata = {
  title: 'サーバー内通報',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

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
      <SettingForm
        channels={sortChannels(channels)}
        roles={sortRoles(roles)}
        setting={reportSettingFormSchema.safeParse(setting).data ?? null}
      />
    </>
  );
}

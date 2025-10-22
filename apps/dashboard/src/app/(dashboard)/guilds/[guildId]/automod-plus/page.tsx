import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { getChannels, getRoles } from '@/lib/discord/api';
import { sortChannels, sortRoles } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { SettingForm } from './form';
import { formSchema } from './schema';

export const metadata: Metadata = {
  title: 'AutoMod Plus',
};

export default async function Page({ params }: PageProps<'/guilds/[guildId]/automod-plus'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const [channels, roles, setting] = await Promise.all([
    getChannels(guildId),
    getRoles(guildId),
    db.query.autoModSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header title='AutoMod Plus' description='特定の条件を満たすメッセージを自動で削除します。' />
      <SettingForm
        channels={sortChannels(channels)}
        roles={sortRoles(roles)}
        setting={formSchema.safeParse(setting).data}
      />
    </>
  );
}

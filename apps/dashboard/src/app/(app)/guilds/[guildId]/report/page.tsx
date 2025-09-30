import type { Metadata } from 'next';
import { FadeInUp } from '@/components/animation';
import { getChannels, getRoles } from '@/lib/discord/api';
import { sortChannels, sortRoles } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import { SettingForm } from './form';
import { settingFormSchema } from './schema';

export const metadata: Metadata = {
  title: 'サーバー内通報',
};

export default async function ({ params }: PageProps<'/guilds/[guildId]/report'>) {
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
    <FadeInUp>
      <SettingForm
        channels={sortChannels(channels)}
        roles={sortRoles(roles)}
        setting={settingFormSchema.safeParse(setting).data ?? null}
      />
    </FadeInUp>
  );
}

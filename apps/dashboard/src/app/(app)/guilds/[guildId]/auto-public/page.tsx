import type { Metadata } from 'next';
import { FadeInUp } from '@/components/animation';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import { SettingForm } from './form';
import { settingFormSchema } from './schema';

export const metadata: Metadata = {
  title: '自動アナウンス公開',
};

export default async function ({ params }: PageProps<'/guilds/[guildId]/auto-public'>) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    db.query.autoPublicSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <FadeInUp>
      <SettingForm
        channels={sortChannels(channels)}
        setting={settingFormSchema.safeParse(setting).data ?? null}
      />
    </FadeInUp>
  );
}

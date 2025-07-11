import type { Metadata } from 'next';
import { FadeInUp } from '@/components/animation';
import { getChannels } from '@/lib/discord/api';
import { filterValidIds, sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { SettingPageProps } from '../types';
import { SettingForm } from './form';
import { settingFormSchema } from './schema';

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
    <FadeInUp>
      <SettingForm
        channels={sortChannels(channels)}
        setting={
          settingFormSchema
            .transform((v) => ({
              ...v,
              ignoreChannels: filterValidIds(v.ignoreChannels, channels),
            }))
            .safeParse(setting).data ?? null
        }
      />
    </FadeInUp>
  );
}

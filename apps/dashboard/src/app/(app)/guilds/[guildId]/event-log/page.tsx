import type { Metadata } from 'next';
import { FadeInUp } from '@/components/animation';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { requireDashboardAccessPermission } from '@/lib/permission';
import { FormContainer } from './form-container';
import { getLogSettings } from './lib';

export const metadata: Metadata = {
  title: 'イベントログ',
};

export default async function ({ params }: PageProps<'/guilds/[guildId]/event-log'>) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [channels, settings] = await Promise.all([getChannels(guildId), getLogSettings(guildId)]);

  return (
    <FadeInUp>
      <FormContainer channels={sortChannels(channels)} settings={settings} />
    </FadeInUp>
  );
}

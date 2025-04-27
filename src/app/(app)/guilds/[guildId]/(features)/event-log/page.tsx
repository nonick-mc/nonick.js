import { Header } from '@/components/header';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { requireDashboardAccessPermission } from '@/lib/permission';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { FormContainer } from './form-container';
import { getLogSettings } from './lib';

export const metadata: Metadata = {
  title: 'イベントログ',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [channels, settings] = await Promise.all([getChannels(guildId), getLogSettings(guildId)]);

  return (
    <>
      <Header
        title='イベントログ'
        description='サーバー内で起こった特定イベントのログを送信します。'
      />
      <FormContainer channels={sortChannels(channels)} settings={settings} />
    </>
  );
}

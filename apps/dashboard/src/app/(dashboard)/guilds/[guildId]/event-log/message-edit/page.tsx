﻿import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { getChannels } from '@/lib/discord/api';
import { sortChannels } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { SettingForm } from './form';
import { formSchema } from './schema';

export const metadata: Metadata = {
  title: 'メッセージ編集ログ',
};

export default async function Page({
  params,
}: PageProps<'/guilds/[guildId]/event-log/message-edit'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const [channels, setting] = await Promise.all([
    getChannels(guildId),
    db.query.msgEditLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header
        title='メッセージ編集ログ'
        description='メッセージが編集された際にログを送信します。'
      />
      <SettingForm channels={sortChannels(channels)} setting={formSchema.safeParse(setting).data} />
    </>
  );
}

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { InfoIcon } from 'lucide-react';
import type { Metadata } from 'next';
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
      <Alert variant='primary'>
        <InfoIcon />
        <AlertTitle>BotやWebhookが送信したメッセージは除外されます</AlertTitle>
        <AlertDescription>
          これらのメッセージは、メッセージが編集された場合でもログは送信されません。
        </AlertDescription>
      </Alert>
      <SettingForm channels={sortChannels(channels)} setting={formSchema.safeParse(setting).data} />
    </>
  );
}

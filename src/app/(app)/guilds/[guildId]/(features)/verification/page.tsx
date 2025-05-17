import { Header } from '@/components/header';
import { getRoles, getUserHighestRole } from '@/lib/discord/api';
import { db } from '@/lib/drizzle';
import { requireDashboardAccessPermission } from '@/lib/permission';
import { Alert } from '@heroui/alert';
import type { Metadata } from 'next';
import type { SettingPageProps } from '../../types';
import { SettingForm } from './form';
import { verificationSettingFormSchema } from './schema';

export const metadata: Metadata = {
  title: 'メンバー認証',
};

export default async function ({ params }: SettingPageProps) {
  const { guildId } = await params;
  await requireDashboardAccessPermission(guildId);

  const [roles, highestRole, setting] = await Promise.all([
    getRoles(guildId),
    getUserHighestRole(guildId, process.env.AUTH_DISCORD_ID),
    db.query.verificationSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header title='メンバー認証' description='特定の認証を行ったユーザーにロールを付与します。' />
      {setting?.enabled && (
        <Alert
          color='success'
          variant='faded'
          title='メンバー認証の準備が整いました！'
          description='チャンネル内で「/create verify-panel」を実行して、認証パネルを送信しましょう。'
        />
      )}
      <SettingForm
        roles={roles}
        highestRolePosition={highestRole.position}
        setting={verificationSettingFormSchema.safeParse(setting).data ?? null}
      />
    </>
  );
}

import { Alert, AlertDescription, AlertTitle } from '@repo/ui/components/alert';
import { CheckCircle2Icon } from 'lucide-react';
import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { verifyDashboardAccessPermission } from '@/lib/dal';
import { getRoles, getUserHighestRole } from '@/lib/discord/api';
import { sortRoles } from '@/lib/discord/utils';
import { db } from '@/lib/drizzle';
import { SettingForm } from './form';
import { formSchema } from './schema';

export const metadata: Metadata = {
  title: 'メンバー認証',
};

export default async function Page({ params }: PageProps<'/guilds/[guildId]/verification'>) {
  const { guildId } = await params;
  await verifyDashboardAccessPermission(guildId);

  const [roles, botHighestRole, setting] = await Promise.all([
    getRoles(guildId),
    getUserHighestRole(guildId, process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID as string),
    db.query.verificationSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    }),
  ]);

  return (
    <>
      <Header title='メンバー認証' description='特定の認証を行ったユーザーにロールを付与します。' />
      {setting?.enabled && (
        <Alert variant='success'>
          <CheckCircle2Icon />
          <AlertTitle>メンバー認証の準備が整いました！</AlertTitle>
          <AlertDescription>
            チャンネル内で「/create verify-panel」を実行して、認証パネルを送信しましょう。
          </AlertDescription>
        </Alert>
      )}
      <SettingForm
        roles={sortRoles(roles)}
        botHighestRolePosition={botHighestRole?.position ?? 0}
        setting={formSchema.safeParse(setting).data}
      />
    </>
  );
}

import { Logo } from '@/components/logo';
import { auth } from '@/lib/auth';
import { getGuild, getGuildMember, isUserJoinedGuild } from '@/lib/discord/api';
import { db } from '@/lib/drizzle';
import { Card } from '@heroui/card';
import { forbidden, notFound } from 'next/navigation';
import { VerificationWizard } from './wizard';

export default async function Page({
  params,
}: {
  params: Promise<{
    guildId: string;
  }>;
}) {
  const { guildId } = await params;

  const guild = await getGuild(guildId).catch(() => null);
  if (!guild) notFound();

  const session = await auth();
  const setting = await db.query.verificationSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guild.id),
  });

  if (!setting?.enabled || !setting.role || setting.captchaType !== 'web') notFound();
  if (!session || !(await isUserJoinedGuild(guild.id))) forbidden();

  const member = await getGuildMember(guild.id, session.user.id);
  const isVerified = member.roles.some((roleId) => roleId === setting.role);

  return (
    <Card className='w-full flex flex-col gap-6 px-6 py-8'>
      <Logo width={110} />
      <VerificationWizard guild={guild} isVerified={isVerified} />
    </Card>
  );
}

import { CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Logo } from '@/components/logo';
import { canAccessVerifyPage, getCachedSession, isAvailableVerifyPage } from '@/lib/dal';
import { getGuild, getGuildMember } from '@/lib/discord/api';
import { getVerificationSetting } from '@/lib/dto';
import { VerificationWizard } from './wizard';

export const metadata: Metadata = {
  title: 'メンバー認証',
};

export default async function Page({ params }: PageProps<'/verify/guilds/[guildId]'>) {
  const { guildId } = await params;

  const isAvailable = await isAvailableVerifyPage(guildId);
  if (!isAvailable) notFound();
  const canAccess = await canAccessVerifyPage(guildId);
  if (!canAccess) notFound();

  const [guild, member, setting] = await Promise.all([
    getGuild(guildId),
    getGuildMember(guildId, (await getCachedSession())?.user.discordUserId as string),
    getVerificationSetting(guildId),
  ]);

  const isVerified = member?.roles.includes(setting?.role as string);

  return (
    <>
      <CardHeader className='gap-6'>
        <Logo height={16} />
        <div className='flex flex-col gap-1'>
          <CardTitle className='text-xl font-extrabold'>メンバー認証</CardTitle>
          <CardDescription>Discordアカウントで認証を行います。</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <VerificationWizard guild={guild} isVerified={isVerified} />
      </CardContent>
    </>
  );
}

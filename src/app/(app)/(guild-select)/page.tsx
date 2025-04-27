import { Icon } from '@/components/icon';
import { auth } from '@/lib/auth';
import { getMutualManagedGuilds, inviteUrl } from '@/lib/discord/api';
import { Card } from '@heroui/card';
import { Link } from '@heroui/link';
import type { Metadata } from 'next';
import { GuildCard } from './guild-card';
import { SessionAlert } from './session-alert';

export const metadata: Metadata = {
  title: 'サーバー選択',
};

export default async function Page() {
  const session = await auth();
  if (session?.error) return <SessionAlert />;

  const guilds = await getMutualManagedGuilds();

  if (!guilds.length) {
    return (
      <div className='grid grid-cols-12 gap-6'>
        <Card
          as={Link}
          className='col-span-12 sm:col-span-6 lg:col-span-3 h-40 flex items-center justify-center gap-4 rounded-medium border-dashed border-content3 border-2 hover:opacity-100 active:opacity-100'
          href={inviteUrl}
          isPressable
        >
          <div className='w-[70px] h-[70px] bg-content2 rounded-full flex items-center justify-center'>
            <Icon icon='solar:widget-add-bold' className='text-4xl text-default-500' />
          </div>
          <p className='text-default-500'>サーバーを追加</p>
        </Card>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-12 gap-6'>
      {guilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  );
}

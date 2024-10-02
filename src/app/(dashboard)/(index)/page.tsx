import { auth } from '@/auth';
import { getMutualManagedGuilds } from '@/lib/discord';
import type { Metadata } from 'next';
import { GuildCard } from './guild-card';

export const metadata: Metadata = {
  title: 'サーバー選択',
};

export default async function Home() {
  const session = await auth();
  if (!session) return null;

  const guilds = await getMutualManagedGuilds(session.user.accessToken);

  return (
    <div className='grid grid-cols-12 gap-6'>
      {guilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  );
}

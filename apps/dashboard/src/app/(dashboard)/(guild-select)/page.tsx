import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getMutualManagedGuilds } from '@/lib/discord/api';
import { GuildCard } from './guild-card';

export const metadata: Metadata = {
  title: 'サーバー選択',
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const guilds = await getMutualManagedGuilds();

  if (!guilds.length) {
    return (
      <Card className='py-24 flex-col justify-center items-center gap-4 text-center'>
        <SearchIcon className='size-8 stroke-muted-foreground' />
        <div className='flex flex-col items-center gap-1'>
          <p>サーバーが見つかりませんでした</p>
          <p className='max-sm:text-sm text-muted-foreground'>
            条件を満たすサーバーがありませんでした
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {guilds.map((guild) => (
        <GuildCard guild={guild} key={guild.id} />
      ))}
    </div>
  );
}

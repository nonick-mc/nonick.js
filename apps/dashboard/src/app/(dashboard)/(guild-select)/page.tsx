import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMutualManagedGuilds } from '@/lib/discord/api';
import { GuildCardContainer } from './guild-card-container';

export const metadata: Metadata = {
  title: 'サーバー選択',
};

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const guilds = await getMutualManagedGuilds();

  return <GuildCardContainer guilds={guilds} />;
}

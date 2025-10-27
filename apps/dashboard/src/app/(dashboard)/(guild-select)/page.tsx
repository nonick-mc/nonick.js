import { Suspense } from 'react';
import { verifySession } from '@/lib/dal';
import { getMutualManagedGuilds } from '@/lib/discord/api';
import { GuildCardContainer } from './guild-card-container';

export default async function Page() {
  await verifySession();
  const guilds = await getMutualManagedGuilds();

  return (
    <Suspense>
      <GuildCardContainer guilds={guilds} />
    </Suspense>
  );
}

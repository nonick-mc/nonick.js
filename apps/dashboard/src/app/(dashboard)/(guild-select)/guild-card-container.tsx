'use client';

import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { useSearchParams } from 'next/navigation';
import { useDebounceValue } from 'usehooks-ts';
import { GuildCard } from './guild-card';

type Props = {
  guilds: RESTAPIPartialCurrentUserGuild[];
};

export function GuildCardContainer({ guilds }: Props) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [debouncedQuery] = useDebounceValue(query, 500);

  const filteredGuilds = guilds.filter(
    (guild) => !debouncedQuery || guild.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  return (
    <div className='grid lg:grid-cols-3 gap-6'>
      {filteredGuilds.map((guild) => (
        <GuildCard guild={guild} key={guild.id} />
      ))}
    </div>
  );
}

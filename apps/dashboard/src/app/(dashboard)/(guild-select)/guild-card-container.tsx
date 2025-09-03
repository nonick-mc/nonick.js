'use client';

import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useDebounceValue } from 'usehooks-ts';
import { Card } from '@/components/ui/card';
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

  if (!filteredGuilds.length) {
    return (
      <Card className='py-24 flex-col justify-center items-center gap-4 text-center'>
        <SearchIcon className='size-8 stroke-muted-foreground' />
        <div className='flex flex-col items-center gap-1'>
          <p>サーバーが見つかりませんでした</p>
          <p className='max-sm:text-sm text-muted-foreground'>
            検索条件を満たすサーバーがありませんでした
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {filteredGuilds.map((guild) => (
        <GuildCard guild={guild} key={guild.id} />
      ))}
    </div>
  );
}

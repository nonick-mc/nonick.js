'use client';

import { Button } from '@repo/ui/components/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui/components/empty';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { PlusIcon, SearchIcon, ServerIcon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDebounceValue } from 'usehooks-ts';
import { inviteBotUrl } from '@/lib/discord/constants';
import { GuildCard } from './guild-card';

type GuildCardContainerProps = {
  guilds: RESTAPIPartialCurrentUserGuild[];
};

export function GuildCardContainer({ guilds }: GuildCardContainerProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [debouncedQuery] = useDebounceValue(query, 500);

  if (!guilds.length) {
    return (
      <Empty className='border bg-card'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <ServerIcon />
          </EmptyMedia>
          <EmptyTitle>サーバーがありません</EmptyTitle>
          <EmptyDescription>まずはサーバーにNoNICK.jsを導入しましょう！</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href={inviteBotUrl}>
              <PlusIcon />
              サーバーを追加
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  const filteredGuilds = guilds.filter(
    (guild) =>
      !debouncedQuery ||
      guild.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      guild.id === debouncedQuery,
  );

  if (!filteredGuilds.length) {
    return (
      <Empty className='border bg-card'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <SearchIcon />
          </EmptyMedia>
          <EmptyTitle>サーバーが見つかりませんでした</EmptyTitle>
          <EmptyDescription>
            検索条件 "{debouncedQuery}" に一致するサーバーが見つかりませんでした。
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {filteredGuilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  );
}

import type { autoCreateThreadRule } from '@repo/database';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@repo/ui/components/empty';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@repo/ui/components/item';
import { cn } from '@repo/ui/lib/utils';
import type { APIGuildChannel, APIRole, GuildChannelType } from 'discord-api-types/v10';
import type { InferSelectModel } from 'drizzle-orm';
import { HashIcon, ListIcon } from 'lucide-react';
import { DeleteRuleDialog } from './_dialogs/delete-rule-dialog';
import { UpdateRuleDialog } from './_dialogs/update-rule-dialog';

type RuleListProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  roles: APIRole[];
  rules: InferSelectModel<typeof autoCreateThreadRule>[];
};

export function RuleList({ channels, roles, rules }: RuleListProps) {
  if (!rules.length) {
    return (
      <Empty className='border border-dashed'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <ListIcon />
          </EmptyMedia>
          <EmptyTitle>チャンネルがありません</EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {rules.map((rule) => {
        const targetChannel = channels.find((channel) => channel.id === rule.channelId);
        const targetChannelName = targetChannel?.name ?? '不明なチャンネル';

        return (
          <Item variant='outline' key={rule.channelId}>
            <ItemMedia>
              <div className='relative w-fit'>
                <HashIcon />
                <span
                  className={cn(
                    'border-background bg-destructive absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2',
                    { 'bg-green-500': rule.enabled },
                    { 'bg-yellow-500': !targetChannel },
                  )}
                >
                  <span className='sr-only'>Busy</span>
                </span>
              </div>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{targetChannelName}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <UpdateRuleDialog
                roles={roles}
                rule={rule}
                targetChannelName={targetChannelName}
                disabled={!targetChannel}
              />
              <DeleteRuleDialog targetChannelName={targetChannelName} rule={rule} />
            </ItemActions>
          </Item>
        );
      })}
    </div>
  );
}

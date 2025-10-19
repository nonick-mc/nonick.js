'use client';

import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import {
  CheckIcon,
  ChevronDownIcon,
  HashIcon,
  ImageIcon,
  type LucideIcon,
  MegaphoneIcon,
  MessageCircleIcon,
  PodcastIcon,
  Volume2Icon,
} from 'lucide-react';
import { createElement, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const ChannelTypeIcons = new Map<GuildChannelType, LucideIcon>([
  [ChannelType.GuildText, HashIcon],
  [ChannelType.GuildVoice, Volume2Icon],
  [ChannelType.GuildForum, MessageCircleIcon],
  [ChannelType.GuildMedia, ImageIcon],
  [ChannelType.GuildStageVoice, PodcastIcon],
  [ChannelType.GuildAnnouncement, MegaphoneIcon],
]);

const DEFAULT_PLACEHOLDER = 'チャンネルを選択';
const DEFAULT_EMPTY_TEXT = 'チャンネルが見つかりません';
const DEFAULT_SEARCH_PLACEHOLDER = 'チャンネルを検索';

type BaseChannelSelectProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  includeChannelTypes?: GuildChannelType[];
  excludeChannelTypes?: GuildChannelType[];
} & Pick<React.ComponentProps<'button'>, 'className' | 'disabled' | 'aria-invalid' | 'id'>;

type ChannelSelectProps = BaseChannelSelectProps & {
  value: string | null;
  onValueChange: (value: string | null) => void;
};

export function ChannelSelect({
  channels,
  value,
  onValueChange,
  placeholder = DEFAULT_PLACEHOLDER,
  emptyText = DEFAULT_EMPTY_TEXT,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  includeChannelTypes,
  excludeChannelTypes,
  ...triggerProps
}: ChannelSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const validChannels = channels.filter((channel) => {
    const include = includeChannelTypes?.includes(channel.type) ?? true;
    const exclude = excludeChannelTypes?.includes(channel.type) ?? false;

    return include && !exclude;
  });

  const selectedChannel = validChannels.find((channel) => channel.id === value);
  const filteredChannels = validChannels.filter((channel) =>
    channel.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...triggerProps}
          variant='outline'
          // biome-ignore lint/a11y/useSemanticElements: Combobox Trigger
          role='combobox'
          aria-expanded={open}
          className={cn('justify-between', triggerProps.className)}
          disabled={triggerProps.disabled}
        >
          {selectedChannel ? (
            <div className='flex items-center gap-2 min-w-0 flex-1'>
              {ChannelTypeIcons.has(selectedChannel.type) &&
                // biome-ignore lint/style/noNonNullAssertion: 95行目でキーの存在を検証済み
                createElement(ChannelTypeIcons.get(selectedChannel.type)!, {
                  className: 'size-4 shrink-0 text-muted-foreground',
                })}
              <span className='truncate min-w-0'>{selectedChannel.name}</span>
            </div>
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0'>
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredChannels.map((channel) => (
                <CommandItem
                  key={channel.id}
                  value={channel.id}
                  onSelect={() => {
                    onValueChange(channel.id === value ? null : channel.id);
                    setOpen(false);
                  }}
                >
                  {ChannelTypeIcons.has(channel.type) &&
                    // biome-ignore lint/style/noNonNullAssertion: 123行目でキーの存在を検証済み
                    createElement(ChannelTypeIcons.get(channel.type)!, {
                      className: 'size-4 shrink-0 text-muted-foreground',
                    })}
                  <span className='truncate'>{channel.name}</span>
                  <CheckIcon
                    className={cn(
                      'ml-auto size-4',
                      value === channel.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

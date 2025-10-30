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
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const ChannelTypeIcons = new Map<GuildChannelType, LucideIcon>([
  [ChannelType.GuildText, HashIcon],
  [ChannelType.GuildVoice, Volume2Icon],
  [ChannelType.GuildForum, MessageCircleIcon],
  [ChannelType.GuildMedia, ImageIcon],
  [ChannelType.GuildStageVoice, PodcastIcon],
  [ChannelType.GuildAnnouncement, MegaphoneIcon],
]);

type ChannelValue = string | string[] | null;
type ChannelSelectProps<TValue extends ChannelValue> = Omit<
  React.ComponentProps<'button'>,
  'value'
> & {
  value: TValue;
  onValueChange: (value: TValue) => void;
  channels: APIGuildChannel<GuildChannelType>[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  includeChannelTypes?: GuildChannelType[];
  excludeChannelTypes?: GuildChannelType[];
  disabledItemFilter?: (channel: APIGuildChannel<GuildChannelType>) => boolean;
  required?: boolean;
  modal?: boolean;
};

export function ChannelSelect<TValue extends ChannelValue>({
  value,
  onValueChange,
  channels,
  placeholder = 'チャンネルを選択',
  emptyText = 'チャンネルが見つかりません',
  searchPlaceholder = 'チャンネルを検索',
  includeChannelTypes,
  excludeChannelTypes,
  disabledItemFilter,
  required = false,
  modal = false,
  ...triggerProps
}: ChannelSelectProps<TValue>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isMobile = useIsMobile();

  const validChannels = channels.filter((channel) => {
    const include = includeChannelTypes?.includes(channel.type) ?? true;
    const exclude = excludeChannelTypes?.includes(channel.type) ?? false;
    return include && !exclude;
  });

  const filteredChannels = validChannels.filter((channel) =>
    channel.name.toLowerCase().includes(search.toLowerCase()),
  );

  const isMultiple = Array.isArray(value);

  const selectedChannels = isMultiple
    ? validChannels.filter((ch) => (value as string[]).includes(ch.id))
    : validChannels.filter((ch) => ch.id === (value as string | null));

  const handleSelect = (channelId: string) => {
    if (isMultiple) {
      const newValues = value.includes(channelId)
        ? value.filter((id) => id !== channelId)
        : [...value, channelId];
      onValueChange(newValues as TValue);
    } else {
      if (required && channelId === value) return;
      const nextValue = channelId === value ? null : channelId;
      onValueChange(nextValue as TValue);
      setOpen(false);
    }
  };

  const ChannelTypeIcon = ({ className, type }: { className: string; type: GuildChannelType }) => {
    const Icon = ChannelTypeIcons.get(type);
    if (!Icon) return null;
    return createElement(Icon, { className });
  };

  return (
    <Popover modal={modal} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...triggerProps}
          variant='outline'
          // biome-ignore lint/a11y/useSemanticElements: Combobox Trigger
          role='combobox'
          aria-expanded={open}
          className={cn(
            'justify-between',
            { 'min-h-9 h-auto': isMultiple },
            triggerProps.className,
          )}
        >
          {selectedChannels.length ? (
            isMultiple ? (
              <div className='flex flex-wrap gap-1 flex-1'>
                {selectedChannels.map((channel) => (
                  <Badge
                    key={channel.id}
                    variant='secondary'
                    className='border border-muted-foreground/20'
                  >
                    <ChannelTypeIcon
                      className='size-4 shrink-0 text-muted-foreground'
                      type={channel.type}
                    />
                    <span className='truncate'>{channel.name}</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className='flex items-center gap-2 min-w-0 flex-1'>
                <ChannelTypeIcon
                  className='size-4 shrink-0 text-muted-foreground'
                  type={selectedChannels[0].type}
                />
                <span className='truncate min-w-0'>{selectedChannels[0].name}</span>
              </div>
            )
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0'
        onOpenAutoFocus={(e) => {
          if (isMobile) e.preventDefault();
        }}
      >
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredChannels.map((channel) => {
                const selected = isMultiple
                  ? (value as string[]).includes(channel.id)
                  : (value as string | null) === channel.id;

                return (
                  <CommandItem
                    key={channel.id}
                    value={channel.id}
                    onSelect={() => handleSelect(channel.id)}
                    disabled={disabledItemFilter?.(channel)}
                  >
                    <ChannelTypeIcon
                      className='size-4 shrink-0 text-muted-foreground'
                      type={channel.type}
                    />
                    <span className='truncate'>{channel.name}</span>
                    <CheckIcon
                      className={cn('ml-auto size-4', selected ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

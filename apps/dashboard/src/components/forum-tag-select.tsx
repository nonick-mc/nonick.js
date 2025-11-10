import { Button } from '@repo/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import { useIsMobile } from '@repo/ui/hooks/use-mobile';
import { cn } from '@repo/ui/lib/utils';
import type { APIGuildForumTag } from 'discord-api-types/v10';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import twemoji from 'twemoji';
import { DiscordEndPoints } from '@/lib/discord/constants';

const DEFAULT_PLACEHOLDER = 'タグを選択';
const DEFAULT_EMPTY_TEXT = 'タグが見つかりません';
const DEFAULT_SEARCH_PLACEHOLDER = 'タグを検索';

type ForumTagSelectProps = Omit<React.ComponentProps<typeof Button>, 'value'> & {
  value: string | null;
  onValueChange: (value: string | null) => void;
  tags: APIGuildForumTag[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
};

export function ForumTagSelect({
  tags,
  value,
  onValueChange,
  placeholder = DEFAULT_PLACEHOLDER,
  emptyText = DEFAULT_EMPTY_TEXT,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  ...triggerProps
}: ForumTagSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isMobile = useIsMobile();

  const selectedTag = tags.find((tag) => tag.id === value);
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()));

  const createTagEmoji = (tag: APIGuildForumTag) => {
    if (tag.emoji_name) {
      return (
        <span
          className='size-4'
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Twemoji
          dangerouslySetInnerHTML={{ __html: twemoji.parse(tag.emoji_name) }}
        />
      );
    }
    if (tag.emoji_id) {
      return (
        <Image
          src={`${DiscordEndPoints.CDN}/emojis/${tag.emoji_id}`}
          width={16}
          height={16}
          alt={`${tag.name}`}
        />
      );
    }
  };

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
          {selectedTag ? (
            <div className='flex items-center gap-2 min-w-0 flex-1'>
              {(selectedTag.emoji_name || selectedTag.emoji_id) && createTagEmoji(selectedTag)}
              <span className='truncate min-w-0'>{selectedTag.name}</span>
            </div>
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-(--radix-popover-trigger-width) p-0'
        onOpenAutoFocus={(e) => {
          if (isMobile) e.preventDefault();
        }}
      >
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredTags.map((tag) => (
                <CommandItem
                  key={tag.id}
                  value={tag.id}
                  onSelect={() => {
                    onValueChange(tag.id === value ? null : tag.id);
                    setOpen(false);
                  }}
                >
                  {(tag.emoji_name || tag.emoji_id) && createTagEmoji(tag)}
                  <span className='truncate'>{tag.name}</span>
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === tag.id ? 'opacity-100' : 'opacity-0',
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

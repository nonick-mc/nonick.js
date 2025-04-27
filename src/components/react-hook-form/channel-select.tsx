'use client';

import { truncateString } from '@/lib/utils';
import { Chip, SelectItem, type SelectedItems } from '@heroui/react';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import { useCallback, useMemo } from 'react';
import type { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form';
import { Icon } from '../icon';
import { ControlledSelect, type ControlledSelectProps } from './ui/select';

const ChannelTypeIcons = new Map<GuildChannelType, string>([
  [ChannelType.GuildAnnouncement, 'solar:mailbox-bold'],
  [ChannelType.AnnouncementThread, 'solar:hashtag-chat-bold'],
  [ChannelType.GuildCategory, 'solar:folder-2-bold'],
  [ChannelType.GuildDirectory, 'solar:notebook-minimalistic-bold'],
  [ChannelType.GuildForum, 'solar:chat-round-bold'],
  [ChannelType.GuildMedia, 'solar:gallery-minimalistic-bold'],
  [ChannelType.GuildStageVoice, 'solar:translation-2-bold'],
  [ChannelType.GuildText, 'solar:hashtag-bold'],
  [ChannelType.GuildVoice, 'solar:volume-loud-bold'],
  [ChannelType.PublicThread, 'solar:hashtag-chat-bold'],
  [ChannelType.PrivateThread, 'solar:hashtag-chat-bold'],
]);

type ChannelSelectProps = {
  channels: APIGuildChannel<GuildChannelType>[];
  channelTypeFilter?: {
    include?: GuildChannelType[];
    exclude?: GuildChannelType[];
  };
  disableItemFilter?: (channel: APIGuildChannel<GuildChannelType>) => boolean;
} & Omit<ControlledSelectProps, 'children' | 'items'>;

/**
 * Discordサーバーのチャンネルを選択するコンポーネント
 * @see https://nextui.org/docs/components/select
 */
export function ChannelSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  channelTypeFilter,
  channels,
  placeholder = 'チャンネルを選択',
  disableItemFilter,
  ...props
}: ChannelSelectProps & UseControllerProps<TFieldValues, TName>) {
  // channelTypeFilterをもとにチャンネルをフィルタリングする
  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const include = channelTypeFilter?.include?.includes(channel.type) ?? true;
      const exclude = channelTypeFilter?.exclude?.includes(channel.type) ?? false;
      return include && !exclude;
    });
  }, [channels, channelTypeFilter]);

  const renderValue = useCallback(
    (items: SelectedItems<APIGuildChannel<GuildChannelType>>) => (
      <div className='flex flex-wrap items-center gap-1'>
        {items.map((item) => {
          if (!item.data) return null;
          if (props.selectionMode === 'multiple') {
            return <MultipleSelectItem channel={item.data} key={item.key} />;
          }
          return <SingleSelectItem channel={item.data} key={item.key} />;
        })}
      </div>
    ),
    [props.selectionMode],
  );

  const renderItem = useCallback(
    (channel: APIGuildChannel<GuildChannelType>) => (
      <SelectItem key={channel.id} textValue={channel.name}>
        <SingleSelectItem channel={channel} />
      </SelectItem>
    ),
    [],
  );

  return (
    <ControlledSelect
      name={name}
      control={control}
      items={filteredChannels}
      placeholder={placeholder}
      renderValue={renderValue}
      disabledKeys={
        disableItemFilter && filteredChannels.filter(disableItemFilter).map((channel) => channel.id)
      }
      {...props}
    >
      {renderItem}
    </ControlledSelect>
  );
}

/**
 * {@link https://nextui.org/docs/components/select#select-events selectionMode}が
 * `single`の場合の`renderValue`に使用するコンポーネント
 */
function SingleSelectItem({ channel }: { channel: APIGuildChannel<GuildChannelType> }) {
  return (
    <div className='flex items-center gap-1'>
      <Icon
        icon={ChannelTypeIcons.get(channel.type) || 'solar:hashtag-bold'}
        className='text-default-500 text-xl'
      />
      <p className='flex-1 truncate text-foreground'>{channel?.name}</p>
    </div>
  );
}

/**
 * {@link https://nextui.org/docs/components/select#select-events selectionMode}が
 * `multiple`の場合の`renderValue`に使用するコンポーネント
 */
function MultipleSelectItem({ channel }: { channel: APIGuildChannel<GuildChannelType> }) {
  return <Chip variant='faded'>{truncateString(channel.name, 16)}</Chip>;
}

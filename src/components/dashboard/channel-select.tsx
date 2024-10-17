'use client';

import { truncateString } from '@/lib/utils';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { Chip } from '@nextui-org/chip';
import { SelectItem, type SelectProps, type SelectedItems } from '@nextui-org/select';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import React from 'react';
import { CustomSelect } from './custom-select';

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
  /** 選択リストに表示するチャンネルの配列 */
  items: APIGuildChannel<GuildChannelType>[];
  /** 選択リストに表示するチャンネルの種類 */
  types?: {
    /** 表示するチャンネルの種類 */
    include?: GuildChannelType[];
    /** 非表示にするチャンネルの種類 */
    exclude?: GuildChannelType[];
  };
  /** 条件を満たすチャンネルの選択を無効にします。（`true`で無効）*/
  disabledKeyFilter?: (channel: APIGuildChannel<GuildChannelType>) => boolean;
} & Omit<SelectProps, 'children' | 'items'>;

/**
 * サーバーのチャンネルを選択するコンポーネント
 * @see https://nextui.org/docs/components/select
 */
export const ChannelSelect = React.forwardRef<HTMLSelectElement, ChannelSelectProps>(
  (
    {
      types,
      items,
      selectionMode,
      placeholder = 'チャンネルを選択',
      disabledKeyFilter = () => false,
      ...props
    },
    ref,
  ) => {
    const filteredChannels = items
      .filter((channel) => (types?.include ? types.include.includes(channel.type) : true))
      .filter((channel) => (types?.exclude ? !types.exclude.includes(channel.type) : true));

    function renderValue(items: SelectedItems<APIGuildChannel<GuildChannelType>>) {
      return (
        <div className='flex flex-wrap items-center gap-1'>
          {items.map((item) => {
            if (!item.data) return null;

            return selectionMode === 'multiple' ? (
              <MultipleSelectItem channel={item.data} key={item.key} />
            ) : (
              <SingleSelectItem channel={item.data} key={item.key} />
            );
          })}
        </div>
      );
    }

    return (
      <CustomSelect
        ref={ref}
        items={filteredChannels}
        selectionMode={selectionMode}
        placeholder={placeholder}
        renderValue={renderValue}
        disabledKeys={filteredChannels.filter((ch) => disabledKeyFilter(ch)).map((ch) => ch.id)}
        {...props}
      >
        {(channel) => (
          <SelectItem key={channel.id} value={channel.id} textValue={channel.name}>
            <SingleSelectItem channel={channel} />
          </SelectItem>
        )}
      </CustomSelect>
    );
  },
);

ChannelSelect.displayName = 'ChannelSelect';

/**
 * {@link https://nextui.org/docs/components/select#select-events selectionMode}が
 * `single`の場合の`renderValue`に使用するコンポーネント
 */
function SingleSelectItem({ channel }: { channel: APIGuildChannel<GuildChannelType> }) {
  return (
    <div className='flex items-center gap-1'>
      <Icon
        icon={ChannelTypeIcons.get(channel.type) || 'solar:hashtag-bold'}
        className='text-[18px] text-default-500'
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
  return <Chip radius='md'>{truncateString(channel.name, 16)}</Chip>;
}

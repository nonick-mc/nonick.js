import { truncateString } from '@/lib/utils';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { Chip } from '@nextui-org/chip';
import { Select, SelectItem, type SelectProps, type SelectedItems } from '@nextui-org/select';
import { cn } from '@nextui-org/theme';
import { type APIGuildChannel, ChannelType, type GuildChannelType } from 'discord-api-types/v10';
import React from 'react';

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
  /** 選択リストに表示するチャンネルの配列（DM、DMグループチャンネルを除く）*/
  channels: APIGuildChannel<GuildChannelType>[];
  /** 選択リストに表示するチャンネルの種類 */
  types?: {
    /** 表示するチャンネルの種類 */
    include?: GuildChannelType[];
    /** 非表示にするチャンネルの種類 */
    exclude?: GuildChannelType[];
  };
  /** 条件を満たすチャンネルの選択を無効にします。（`true`で無効）*/
  disabledKeyFilter?: (channel: APIGuildChannel<GuildChannelType>) => boolean;
} & Omit<SelectProps, 'items' | 'children' | 'isMultiline'>;

/**
 * チャンネルを配置順に並べ替える
 */
const sortChannels = (channels: APIGuildChannel<GuildChannelType>[]) => {
  const categories = channels.filter((channel) => channel.type === ChannelType.GuildCategory);
  const otherChannels = channels.filter((channel) => channel.type !== ChannelType.GuildCategory);

  categories.sort((a, b) => a.position - b.position);

  const sortedChannels: APIGuildChannel<GuildChannelType>[] = [];

  for (const category of categories) {
    sortedChannels.push(category);

    const childChannels = otherChannels.filter((channel) => channel.parent_id === category.id);
    const voiceChannels = childChannels.filter((channel) =>
      [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type),
    );
    const textChannels = childChannels.filter(
      (channel) => !voiceChannels.some((v) => v.id === channel.id),
    );

    voiceChannels.sort((a, b) => a.position - b.position);
    textChannels.sort((a, b) => a.position - b.position);

    sortedChannels.push(...textChannels, ...voiceChannels);
  }

  const rootChannels = otherChannels.filter((channel) => !channel.parent_id);
  const rootVoiceChannels = rootChannels.filter((channel) =>
    [ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(channel.type),
  );
  const rootTextChannels = rootChannels.filter(
    (channel) => !rootVoiceChannels.some((v) => v.id === channel.id),
  );

  rootVoiceChannels.sort((a, b) => a.position - b.position);
  rootTextChannels.sort((a, b) => a.position - b.position);

  sortedChannels.unshift(...rootTextChannels, ...rootVoiceChannels);
  return sortedChannels;
};

/**
 * サーバーのチャンネルを選択するコンポーネント
 * @see https://nextui.org/docs/components/select
 */
const ChannelSelect = React.forwardRef<HTMLSelectElement, ChannelSelectProps>(
  (
    {
      types,
      channels,
      classNames,
      selectionMode = 'single',
      variant = 'bordered',
      placeholder = 'チャンネルを選択',
      disabledKeyFilter = () => false,
      ...props
    },
    ref,
  ) => {
    const sortedChannel = sortChannels(channels)
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
      <Select
        ref={ref}
        items={sortedChannel}
        variant={variant}
        placeholder={placeholder}
        renderValue={renderValue}
        selectionMode={selectionMode}
        isMultiline={selectionMode === 'multiple'}
        disabledKeys={sortedChannel.filter((ch) => disabledKeyFilter(ch)).map((ch) => ch.id)}
        listboxProps={{ variant: 'flat' }}
        classNames={{
          ...classNames,
          base: cn(
            { 'md:max-w-[320px]': selectionMode === 'single' },
            { 'md:max-w-[400px]': selectionMode === 'multiple' },
            classNames?.base,
          ),
          trigger: cn({ 'py-2': selectionMode === 'multiple' }, classNames?.trigger),
        }}
        {...props}
      >
        {(channel) => (
          <SelectItem key={channel.id} value={channel.id} textValue={channel.name}>
            <SingleSelectItem channel={channel} />
          </SelectItem>
        )}
      </Select>
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

export { ChannelSelect };

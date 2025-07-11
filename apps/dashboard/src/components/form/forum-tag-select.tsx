'use client';

import { Chip, type SelectedItems, SelectItem } from '@heroui/react';
import type { APIGuildForumTag } from 'discord-api-types/v10';
import Image from 'next/image';
import { useCallback } from 'react';
import { DiscordEndPoints } from '@/lib/discord/constants';
import { truncateString } from '@/lib/utils';
import { Icon } from '../icon';
import { type SelectFieldProps, StringSelectField } from './ui/select';

type ForumTagsSelectProps = {
  tags: APIGuildForumTag[];
  disableItemFilter?: (tag: APIGuildForumTag) => boolean;
} & Omit<SelectFieldProps, 'children' | 'items'>;

/**
 * フォーラムチャンネルのタグを選択するコンポーネント
 * @see https://nextui.org/docs/components/select
 */
export function ForumTagSelectField({
  tags,
  placeholder = 'タグを選択',
  disableItemFilter,
  ...props
}: ForumTagsSelectProps) {
  const renderValue = useCallback(
    (items: SelectedItems<APIGuildForumTag>) => (
      <div className='flex flex-wrap items-center gap-1'>
        {items.map((item) => {
          if (!item.data) return null;
          if (props.selectionMode === 'multiple') {
            return <MultipleSelectItem tag={item.data} key={item.key} />;
          }
          return <SingleSelectItem tag={item.data} key={item.key} />;
        })}
      </div>
    ),
    [props.selectionMode],
  );

  const renderItem = useCallback(
    (tag: APIGuildForumTag) => (
      <SelectItem key={tag.id} textValue={tag.name}>
        <SingleSelectItem tag={tag} />
      </SelectItem>
    ),
    [],
  );

  return (
    <StringSelectField
      items={tags}
      placeholder={placeholder}
      renderValue={renderValue}
      disabledKeys={disableItemFilter && tags.filter(disableItemFilter).map((tag) => tag.id)}
      {...props}
    >
      {renderItem}
    </StringSelectField>
  );
}

/**
 * {@link https://nextui.org/docs/components/select#select-events selectionMode}が
 * `single`の場合の`renderValue`に使用するコンポーネント
 */
function SingleSelectItem({ tag }: { tag: APIGuildForumTag }) {
  let startContent = <Icon icon='solar:tag-bold' className='text-default-500 text-2xl' />;

  if (tag.emoji_name) {
    startContent = <p className='text-lg'>{tag.emoji_name}</p>;
  }
  if (tag.emoji_id) {
    startContent = (
      <Image
        src={`${DiscordEndPoints.CDN}/emojis/${tag.emoji_id}.webp`}
        width={24}
        height={24}
        alt={`${tag.name}の絵文字`}
      />
    );
  }

  return (
    <div className='flex items-center gap-2'>
      {startContent}
      <p className='flex-1 truncate text-foreground'>{tag.name}</p>
    </div>
  );
}

/**
 * {@link https://nextui.org/docs/components/select#select-events selectionMode}が
 * `multiple`の場合の`renderValue`に使用するコンポーネント
 */
function MultipleSelectItem({ tag }: { tag: APIGuildForumTag }) {
  return <Chip variant='faded'>{truncateString(tag.name, 16)}</Chip>;
}

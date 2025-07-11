'use client';

import { Chip, type SelectedItems, SelectItem } from '@heroui/react';
import type { APIRole } from 'discord-api-types/v10';
import { useCallback } from 'react';
import { truncateString } from '@/lib/utils';
import { type SelectFieldProps, StringSelectField } from './ui/select';

type RoleSelectProps = {
  roles: APIRole[];
  disableItemFilter?: (role: APIRole) => boolean;
} & Omit<SelectFieldProps, 'children' | 'items'>;

export function RoleSelectField({
  roles,
  placeholder = 'ロールを選択',
  disableItemFilter,
  ...props
}: RoleSelectProps) {
  const renderValue = useCallback(
    (items: SelectedItems<APIRole>) => (
      <div className='flex flex-wrap items-center gap-1'>
        {items.map((item) => {
          if (!item.data) return null;
          if (props.selectionMode === 'multiple') {
            return <MultipleSelectItem role={item.data} key={item.key} />;
          }
          return <SingleSelectItem role={item.data} key={item.key} />;
        })}
      </div>
    ),
    [props.selectionMode],
  );

  const renderItem = useCallback(
    (role: APIRole) => (
      <SelectItem key={role.id} textValue={role.name}>
        <SingleSelectItem role={role} />
      </SelectItem>
    ),
    [],
  );

  return (
    <StringSelectField
      items={roles}
      placeholder={placeholder}
      renderValue={renderValue}
      disabledKeys={
        disableItemFilter && roles.filter(disableItemFilter).map((channel) => channel.id)
      }
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
function SingleSelectItem({ role }: { role: APIRole }) {
  return (
    <div className='flex items-center gap-2'>
      <RoleColorDot color={role.color} />
      <p className='flex-1 text-foreground truncate'>{role.name}</p>
    </div>
  );
}

/**
 * {@link https://nextui.org/docs/components/select#select-events selectionMode}が
 * `multiple`の場合の`renderValue`に使用するコンポーネント
 */
function MultipleSelectItem({ role }: { role: APIRole }) {
  return (
    <Chip variant='faded' startContent={<RoleColorDot color={role.color} />}>
      {truncateString(role.name, 15)}
    </Chip>
  );
}

/**
 * ロールの色を示すドット
 */
function RoleColorDot({ color }: { color: number }) {
  return (
    <div className='flex size-[18px] items-center justify-center'>
      <div
        className='h-3 w-3 rounded-full'
        style={{
          backgroundColor: color ? `#${color.toString(16)}` : 'GrayText',
        }}
      />
    </div>
  );
}

import { truncateString } from '@/lib/utils';
import { Chip } from '@nextui-org/chip';
import { Select, SelectItem, type SelectProps, type SelectedItems } from '@nextui-org/select';
import { cn } from '@nextui-org/theme';
import type { APIRole } from 'discord-api-types/v10';
import React from 'react';

type RoleSelectProps = {
  /** 選択リストに表示するロールの配列 */
  roles: APIRole[];
  /** 条件を満たすチャンネルの選択を無効にします。（`true`で無効）*/
  disabledKeyFilter?: (role: APIRole) => boolean;
} & Omit<SelectProps, 'items' | 'children' | 'isMultiline'>;

/**
 * サーバーのロールを選択するコンポーネント
 * @see https://nextui.org/docs/components/select
 */
const RoleSelect = React.forwardRef<HTMLSelectElement, RoleSelectProps>(
  (
    {
      roles,
      classNames,
      selectionMode = 'single',
      variant = 'bordered',
      placeholder = 'ロールを選択',
      disabledKeyFilter = () => false,
      ...props
    },
    ref,
  ) => {
    const sortedRole = roles.sort((a, b) => b.position - a.position);

    function renderValue(items: SelectedItems<APIRole>) {
      return (
        <div className='flex flex-wrap items-center gap-1'>
          {items.map((item) => {
            if (!item.data) return null;

            return selectionMode === 'multiple' ? (
              <MultipleSelectItem role={item.data} key={item.key} />
            ) : (
              <SingleSelectItem role={item.data} key={item.key} />
            );
          })}
        </div>
      );
    }

    return (
      <Select
        ref={ref}
        items={sortedRole}
        variant={variant}
        placeholder={placeholder}
        renderValue={renderValue}
        selectionMode={selectionMode}
        isMultiline={selectionMode === 'multiple'}
        disabledKeys={sortedRole.filter((role) => disabledKeyFilter(role)).map((role) => role.id)}
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
        {(role) => (
          <SelectItem key={role.id} value={role.id} textValue={role.name}>
            <SingleSelectItem role={role} />
          </SelectItem>
        )}
      </Select>
    );
  },
);

RoleSelect.displayName = 'RoleSelect';

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
    <Chip radius='sm' startContent={<RoleColorDot color={role.color} />}>
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

export { RoleSelect };

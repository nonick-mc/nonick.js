'use client';

import type { APIRole } from 'discord-api-types/v10';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
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
import { Badge } from './ui/badge';

type RoleValue = string | string[] | null;
type RoleSelectProps<TValue extends RoleValue> = Omit<React.ComponentProps<'button'>, 'value'> & {
  value: TValue;
  onValueChange: (value: TValue) => void;
  roles: APIRole[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabledItemFilter?: (role: APIRole) => boolean;
  required?: boolean;
};

export function RoleSelect<TValue extends RoleValue>({
  value,
  onValueChange,
  roles,
  placeholder = 'ロールを選択',
  emptyText = 'ロールが見つかりません',
  searchPlaceholder = 'ロールを検索',
  disabledItemFilter,
  required = false,
  ...triggerProps
}: RoleSelectProps<TValue>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()),
  );

  const isMultiple = Array.isArray(value);

  const selectedRoles = isMultiple
    ? roles.filter((role) => (value as string[]).includes(role.id))
    : roles.filter((role) => role.id === (value as string | null));

  const handleSelect = (roleId: string) => {
    if (isMultiple) {
      const newValues = value.includes(roleId)
        ? value.filter((id) => id !== roleId)
        : [...value, roleId];
      onValueChange(newValues as TValue);
    } else {
      if (required && roleId === value) return;
      const nextValue = roleId === value ? null : roleId;
      onValueChange(nextValue as TValue);
      setOpen(false);
    }
  };

  const RoleColorIcon = ({ role }: { role: APIRole }) => (
    <span
      className='size-2 rounded-full shrink-0'
      style={{
        backgroundColor: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : '#808080',
      }}
    />
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
          className={cn('justify-between', isMultiple && 'min-h-9 h-auto', triggerProps.className)}
        >
          {selectedRoles.length ? (
            isMultiple ? (
              <div className='flex flex-wrap gap-1 flex-1'>
                {selectedRoles.map((role) => (
                  <Badge
                    key={role.id}
                    variant='secondary'
                    className='border border-muted-foreground/20'
                  >
                    <RoleColorIcon role={role} />
                    <span className='truncate'>{role.name}</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className='flex items-center gap-2 min-w-0 flex-1'>
                <RoleColorIcon role={selectedRoles[0]} />
                <span className='truncate min-w-0'>{selectedRoles[0].name}</span>
              </div>
            )
          ) : (
            placeholder
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
              {filteredRoles.map((role) => {
                const selected = isMultiple
                  ? (value as string[]).includes(role.id)
                  : (value as string | null) === role.id;

                return (
                  <CommandItem
                    key={role.id}
                    value={role.id}
                    onSelect={() => handleSelect(role.id)}
                    disabled={disabledItemFilter?.(role)}
                  >
                    <RoleColorIcon role={role} />
                    <span className='truncate'>{role.name}</span>
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

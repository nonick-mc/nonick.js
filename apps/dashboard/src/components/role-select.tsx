'use client';

import { Badge } from '@repo/ui/components/badge';
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
import type { APIRole } from 'discord-api-types/v10';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';

type RoleValue = string | string[] | null;
type RoleSelectProps<TValue extends RoleValue> = Omit<
  React.ComponentProps<typeof Button>,
  'value'
> & {
  value: TValue;
  onValueChange: (value: TValue) => void;
  roles: APIRole[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabledItemFilter?: (role: APIRole) => boolean;
  required?: boolean;
  modal?: boolean;
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
  modal = false,
  ...triggerProps
}: RoleSelectProps<TValue>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isMobile = useIsMobile();

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
          {selectedRoles.length ? (
            isMultiple ? (
              <div className='flex flex-wrap gap-1 flex-1'>
                {selectedRoles.map((role) => (
                  <Badge
                    key={role.id}
                    variant='secondary'
                    className='border border-muted-foreground/20'
                  >
                    <RoleColorIcon color={role.color} />
                    <span className='truncate'>{role.name}</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className='flex items-center gap-2 min-w-0 flex-1'>
                <RoleColorIcon color={selectedRoles[0]?.color} />
                <span className='truncate min-w-0'>{selectedRoles[0]?.name}</span>
              </div>
            )
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-(--radix-popover-trigger-width) min-w-[300px] p-0'
        onOpenAutoFocus={(e) => {
          if (isMobile) e.preventDefault();
        }}
      >
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
                    <RoleColorIcon color={role.color} />
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

function RoleColorIcon({ color }: { color?: number }) {
  return (
    <span
      className='size-2 rounded-full shrink-0'
      style={{
        backgroundColor: color ? `#${color.toString(16).padStart(6, '0')}` : '#808080',
      }}
    />
  );
}

'use client';

import type { APIRole } from 'discord-api-types/v10';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const DEFAULT_PLACEHOLDER = 'ロールを選択';
const DEFAULT_EMPTY_TEXT = 'ロールが見つかりません';
const DEFAULT_SEARCH_PLACEHOLDER = 'ロールを検索';

type BaseRoleSelectProps = {
  roles: APIRole[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabledItemFilter?: (role: APIRole) => boolean;
} & Pick<React.ComponentProps<'button'>, 'className' | 'disabled' | 'aria-invalid' | 'id'>;

type MultipleRoleSelectProps = BaseRoleSelectProps & {
  value: string[];
  onValueChange: (value: string[]) => void;
};

export function MultipleRoleSelect({
  roles,
  value,
  onValueChange,
  placeholder = DEFAULT_PLACEHOLDER,
  emptyText = DEFAULT_EMPTY_TEXT,
  searchPlaceholder = DEFAULT_SEARCH_PLACEHOLDER,
  disabledItemFilter,
  ...triggerProps
}: MultipleRoleSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedRoles = roles.filter((role) => value.includes(role.id));
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (roleId: string) => {
    if (value.includes(roleId)) {
      onValueChange(value.filter((id) => id !== roleId));
    } else {
      onValueChange([...value, roleId]);
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
          className={cn('justify-between min-h-9 h-auto', triggerProps.className)}
          disabled={triggerProps.disabled}
        >
          {selectedRoles.length ? (
            <div className='flex flex-wrap gap-1 flex-1'>
              {selectedRoles.map((role) => (
                <Badge
                  key={role.id}
                  variant='secondary'
                  className='border border-muted-foreground/20'
                >
                  <span
                    className='size-2 rounded-full'
                    style={{
                      backgroundColor: role.color ? `#${role.color.toString(16)}` : 'GrayText',
                    }}
                  />
                  {role.name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
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
              {filteredRoles.map((role) => (
                <CommandItem
                  key={role.id}
                  value={role.id}
                  onSelect={() => handleSelect(role.id)}
                  disabled={disabledItemFilter?.(role)}
                >
                  <span
                    className='size-2 rounded-full'
                    style={{
                      backgroundColor: role.color ? `#${role.color.toString(16)}` : 'GrayText',
                    }}
                  />
                  <span className='truncate'>{role.name}</span>
                  <CheckIcon
                    className={cn(
                      'ml-auto size-4',
                      value.includes(role.id) ? 'opacity-100' : 'opacity-0',
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

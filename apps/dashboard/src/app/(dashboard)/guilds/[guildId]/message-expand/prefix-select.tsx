import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ignorePrefixes } from './schema';

interface PrefixSelectProps extends Omit<React.ComponentProps<'button'>, 'value' | 'onChange'> {
  value: string[];
  onValueChange: (value: string[]) => void;
}

export function PrefixSelect({ value, onValueChange, ...props }: PrefixSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedPrefixes = ignorePrefixes.filter((prefix) => value.includes(prefix));

  const handleSelect = (prefix: string) => {
    onValueChange(value.includes(prefix) ? value.filter((p) => p !== prefix) : [...value, prefix]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...props}
          variant='outline'
          // biome-ignore lint/a11y/useSemanticElements: Combobox Trigger
          role='combobox'
          aria-expanded={open}
          className={cn('justify-between', props.className)}
          disabled={props.disabled}
        >
          {selectedPrefixes.length ? (
            <div className='flex flex-wrap gap-1 flex-1'>
              {selectedPrefixes.map((prefix) => (
                <Badge
                  key={prefix}
                  variant='secondary'
                  className='border border-muted-foreground/20'
                >
                  {prefix}
                </Badge>
              ))}
            </div>
          ) : (
            <span className='text-muted-foreground'>プレフィックスを選択</span>
          )}
          <ChevronDownIcon className='ml-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[var(--radix-popover-trigger-width)] min-w-[300px] p-0'>
        <Command>
          <CommandList>
            <CommandEmpty>プレフィックスが見つかりません</CommandEmpty>
            <CommandGroup>
              {ignorePrefixes.map((prefix) => (
                <CommandItem key={prefix} value={prefix} onSelect={() => handleSelect(prefix)}>
                  {prefix}
                  <CheckIcon
                    className={cn(
                      'ml-auto size-4',
                      value.includes(prefix) ? 'opacity-100' : 'opacity-0',
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

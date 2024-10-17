'use client';

import { Select, type SelectProps } from '@nextui-org/select';
import { cn } from '@nextui-org/theme';
import React from 'react';

export const CustomSelect = React.forwardRef<HTMLSelectElement, SelectProps<object>>(
  (
    { classNames, selectionMode = 'single', variant = 'bordered', placeholder = '選択', ...props },
    ref,
  ) => {
    return (
      <Select
        ref={ref}
        variant='bordered'
        placeholder={placeholder}
        selectionMode={selectionMode}
        isMultiline={selectionMode === 'multiple'}
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
      />
    );
  },
) as <T extends object>(p: SelectProps<T> & { ref?: React.Ref<HTMLSelectElement> }) => JSX.Element;

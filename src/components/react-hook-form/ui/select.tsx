'use client';

import { Select, type SelectProps, type SharedSelection, cn } from '@heroui/react';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type ControlledSelectProps<T extends object = object> = Omit<
  SelectProps<T>,
  'ref' | 'onBlur' | 'onSelectionChange' | 'selectedKeys' | 'isInvalid' | 'errorMessage'
>;

export function ControlledSelect<
  T extends object,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  labelPlacement = 'outside',
  listboxProps,
  classNames,
  ...props
}: SelectProps<T> & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });
  const isMultiple = props.selectionMode === 'multiple';

  const onChange = (keys: SharedSelection) => {
    field.onChange(isMultiple ? Array.from(keys) : (keys.currentKey ?? ''));
  };

  return (
    <Select
      // React Hook Form
      ref={field.ref}
      onBlur={field.onBlur}
      onSelectionChange={onChange}
      selectedKeys={Array.isArray(field.value) ? field.value : [field.value]}
      isInvalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      // Other
      labelPlacement={labelPlacement}
      classNames={{
        ...classNames,
        label: cn('pb-1', classNames?.label),
        description: cn('text-sm max-sm:text-xs', classNames?.description),
        errorMessage: cn('text-sm max-sm:text-xs', classNames?.errorMessage),
        trigger: cn(
          'min-h-12 py-2 data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_14px)] transition-background',
          classNames?.trigger,
        ),
      }}
      listboxProps={{
        ...listboxProps,
        variant: 'flat',
      }}
      isMultiline={isMultiple}
      {...props}
    />
  );
}

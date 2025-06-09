'use client';

import { NumberInput, type NumberInputProps } from '@heroui/react';
import { cn } from '@heroui/theme';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type ControlledNumberInputProps = Omit<
  NumberInputProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function ControlledNumberInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  variant = 'flat',
  labelPlacement = 'outside',
  classNames,
  ...props
}: ControlledNumberInputProps & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <NumberInput
      // React Hook Form
      ref={field.ref}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      isInvalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      // Other
      classNames={{
        ...classNames,
        label: cn('text-sm', classNames?.label),
        description: cn('text-sm max-sm:text-xs', classNames?.description),
        errorMessage: cn('text-sm max-sm:text-xs', classNames?.errorMessage),
      }}
      variant={variant}
      labelPlacement={labelPlacement}
      {...props}
    />
  );
}

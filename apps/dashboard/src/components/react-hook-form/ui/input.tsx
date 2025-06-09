'use client';

import { Input, type InputProps } from '@heroui/input';
import { cn } from '@heroui/react';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type ControlledInputProps = Omit<
  InputProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function ControlledInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  variant = 'flat',
  classNames,
  ...props
}: ControlledInputProps & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <Input
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
      {...props}
    />
  );
}

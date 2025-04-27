'use client';

import { RadioGroup, type RadioGroupProps } from '@heroui/radio';
import { cn } from '@heroui/theme';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type ControlledRadioGroup = Omit<
  RadioGroupProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function ControlledRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  classNames,
  ...props
}: ControlledRadioGroup & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <RadioGroup
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
        label: cn(
          'text-sm text-foreground',
          { 'opacity-disabled': props.isDisabled },
          classNames?.label,
        ),
      }}
      {...props}
    />
  );
}

'use client';

import {
  Checkbox,
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxProps,
} from '@heroui/checkbox';
import { cn } from '@heroui/theme';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

export type ControlledCheckboxGroupProps = Omit<
  CheckboxGroupProps,
  'ref' | 'onChange' | 'onValueChange' | 'onBlur' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function ControlledCheckboxGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  classNames,
  ...props
}: ControlledCheckboxGroupProps & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <CheckboxGroup
      // React Hook Form
      ref={field.ref}
      onValueChange={(v) => field.onChange(v.sort())}
      onBlur={field.onBlur}
      value={field.value}
      isInvalid={fieldState.invalid}
      errorMessage={fieldState.error?.message}
      // Other
      classNames={{
        ...classNames,
        label: cn(
          'text-foreground text-sm',
          { 'opacity-disabled': props.isDisabled },
          classNames?.label,
        ),
        description: cn('text-sm max-sm:text-xs', classNames?.description),
      }}
      {...props}
    />
  );
}

export type ControlledCheckboxProps = Omit<
  CheckboxProps,
  'ref' | 'onChange' | 'onValueChange' | 'onBlur' | 'value' | 'isInvalid'
>;

export function ControlledCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  classNames,
  ...props
}: ControlledCheckboxProps & UseControllerProps<TFieldValues, TName>) {
  const { field, fieldState } = useController({ name, control });

  return (
    <Checkbox
      // React Hook Form
      ref={field.ref}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      isInvalid={fieldState.invalid}
      // Other
      classNames={{
        ...classNames,
        label: cn('text-sm', classNames?.label),
      }}
      {...props}
    />
  );
}

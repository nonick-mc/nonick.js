'use client';

import { Switch, type SwitchProps, cn } from '@heroui/react';
import type { HTMLAttributes, ReactNode } from 'react';
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from 'react-hook-form';

type ControlledSwitchProps = {
  label?: ReactNode;
  description?: ReactNode;
  wrapperClass?: string;
} & Omit<SwitchProps, 'ref' | 'onChange' | 'onValueChange' | 'onBlur' | 'isSelected'>;

export function ControlledSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  description,
  wrapperClass,
  ...props
}: ControlledSwitchProps & UseControllerProps<TFieldValues, TName>) {
  const { field } = useController({ name, control });

  return (
    <div className={cn('flex justify-between flex-row-reverse items-center gap-3', wrapperClass)}>
      <Switch
        // React Hook Form
        ref={field.ref}
        onValueChange={field.onChange}
        onBlur={field.onBlur}
        isSelected={field.value}
        // Other
        {...props}
      />
      <div className={cn('flex flex-col max-sm:gap-1', { 'opacity-disabled': props.isDisabled })}>
        <SwitchLabel>{label}</SwitchLabel>
        {description && <SwitchDescription>{description}</SwitchDescription>}
      </div>
    </div>
  );
}

function SwitchLabel({ className, ...props }: HTMLAttributes<HTMLLabelElement>) {
  // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
  return <label className={cn('text-sm', className)} {...props} />;
}

function SwitchDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm max-sm:text-xs text-default-500', className)} {...props} />;
}

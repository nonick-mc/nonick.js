import { cn, Switch, type SwitchProps } from '@heroui/react';
import type { HTMLAttributes, ReactNode } from 'react';
import { useFieldContext } from '../context';

export type SwitchFieldProps = {
  label?: ReactNode;
  description?: ReactNode;
  wrapperClass?: string;
} & Omit<SwitchProps, 'onValueChange' | 'onBlur' | 'isSelected'>;

export function SwitchField({ label, description, wrapperClass, ...props }: SwitchFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <div className={cn('flex justify-between flex-row-reverse items-center gap-3', wrapperClass)}>
      <Switch
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        isSelected={field.state.value}
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
  // biome-ignore lint: false
  return <label className={cn('text-sm', className)} {...props} />;
}

function SwitchDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm max-sm:text-xs text-default-500', className)} {...props} />;
}

import { cn, Switch, type SwitchProps } from '@heroui/react';
import type { ReactNode } from 'react';
import { useFieldContext } from '../context';
import { FieldLabel } from './label';

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
      <FieldLabel label={label} description={description} isDisabled={props.isDisabled} />
    </div>
  );
}

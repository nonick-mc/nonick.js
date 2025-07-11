import { CheckboxGroup, type CheckboxGroupProps } from '@heroui/checkbox';
import { cn } from '@heroui/theme';
import { useFieldContext } from '../context';

export type CheckboxGroupFieldProps = Omit<
  CheckboxGroupProps,
  'ref' | 'onChange' | 'onValueChange' | 'onBlur' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function NumberCheckboxGroupField({ classNames, ...props }: CheckboxGroupProps) {
  const field = useFieldContext<number[]>();

  return (
    <CheckboxGroup
      onValueChange={(vaule) => field.handleChange(vaule.map((v) => Number(v)).sort())}
      onBlur={field.handleBlur}
      value={field.state.value.map((v) => String(v))}
      isInvalid={!field.state.meta.isValid}
      errorMessage={field.state.meta.errors.map((e) => e.message).join(',')}
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

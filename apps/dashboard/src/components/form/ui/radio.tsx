import { RadioGroup, type RadioGroupProps } from '@heroui/radio';
import { cn } from '@heroui/theme';
import { useFieldContext } from '../context';

export type RadioGroupFieldProps = Omit<
  RadioGroupProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function NumberRadioGroupField({ classNames, ...props }: RadioGroupFieldProps) {
  const field = useFieldContext<number>();

  return (
    <RadioGroup
      onValueChange={(v) => field.handleChange(Number(v))}
      onBlur={field.handleBlur}
      value={String(field.state.value)}
      isInvalid={!field.state.meta.isValid}
      errorMessage={field.state.meta.errors.map((e) => e.message).join(',')}
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

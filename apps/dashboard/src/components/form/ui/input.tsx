import { Input, type InputProps, NumberInput, type NumberInputProps } from '@heroui/react';
import { cn } from '@heroui/theme';
import { useFieldContext } from '../context';

export type InputFieldProps = Omit<
  InputProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export type NumberInputFieldProps = Omit<
  NumberInputProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function InputField({ variant = 'flat', classNames, ...props }: InputFieldProps) {
  const field = useFieldContext<string>();

  return (
    <Input
      onValueChange={field.handleChange}
      onBlur={field.handleBlur}
      value={field.state.value}
      isInvalid={!field.state.meta.isValid}
      errorMessage={field.state.meta.errors.map((e) => e.message).join(',')}
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

export function NumberInputField({
  variant = 'flat',
  labelPlacement = 'outside',
  classNames,
  ...props
}: NumberInputFieldProps) {
  const field = useFieldContext<number>();

  return (
    <NumberInput
      onValueChange={field.handleChange}
      onBlur={field.handleBlur}
      value={field.state.value}
      isInvalid={!field.state.meta.isValid}
      errorMessage={field.state.meta.errors.map((e) => e.message).join(',')}
      classNames={{
        ...classNames,
        label: cn('text-sm pb-1', classNames?.label),
        description: cn('text-sm max-sm:text-xs', classNames?.description),
        errorMessage: cn('text-sm max-sm:text-xs', classNames?.errorMessage),
        inputWrapper: cn('min-h-12', classNames?.inputWrapper),
      }}
      variant={variant}
      labelPlacement={labelPlacement}
      {...props}
    />
  );
}

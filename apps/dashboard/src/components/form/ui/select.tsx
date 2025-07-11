import { cn, Select, type SelectProps } from '@heroui/react';
import { useFieldContext } from '../context';

export type SelectFieldProps<T extends object = object> = Omit<
  SelectProps<T>,
  'onBlur' | 'onSelectionChange' | 'selectedKeys' | 'isInvalid' | 'errorMessage'
>;

export function StringSelectField<T extends object>({
  listboxProps,
  labelPlacement = 'outside',
  classNames,
  ...props
}: SelectFieldProps<T>) {
  const field = useFieldContext<string | string[]>();
  const isMultiple = props.selectionMode === 'multiple';

  return (
    <Select
      onBlur={field.handleBlur}
      onSelectionChange={(keys) =>
        field.handleChange(isMultiple ? (Array.from(keys) as string[]) : (keys.currentKey ?? ''))
      }
      selectedKeys={Array.isArray(field.state.value) ? field.state.value : [field.state.value]}
      isInvalid={!field.state.meta.isValid}
      errorMessage={field.state.meta.errors.map((e) => e.message).join(',')}
      classNames={{
        ...classNames,
        label: cn('pb-1', classNames?.label),
        description: cn('text-sm max-sm:text-xs', classNames?.description),
        errorMessage: cn('text-sm max-sm:text-xs', classNames?.errorMessage),
        trigger: cn(
          'min-h-12 py-2 data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_14px)] transition-background',
          classNames?.trigger,
        ),
      }}
      listboxProps={{
        ...listboxProps,
        variant: 'flat',
      }}
      labelPlacement={labelPlacement}
      isMultiline={isMultiple}
      {...props}
    />
  );
}

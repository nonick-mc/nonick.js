'use client';

import { cn, type TextAreaProps, Textarea } from '@heroui/react';
import { useFieldContext } from '../context';

export type TextareaFieldProps = Omit<
  TextAreaProps,
  'ref' | 'onChange' | 'onValueChange' | 'value' | 'isInvalid' | 'errorMessage'
>;

export function TextareaField({ classNames, variant = 'flat', ...props }: TextareaFieldProps) {
  const field = useFieldContext<string>();

  return (
    <Textarea
      onValueChange={field.handleChange}
      onBlur={field.handleBlur}
      value={field.state.value}
      isInvalid={!field.state.meta.isValid}
      errorMessage={field.state.meta.errors.map((e) => e.message).join(',')}
      classNames={{
        ...classNames,
        description: cn('text-sm text-default-500 max-sm:text-xs', classNames?.description),
        errorMessage: cn('text-sm max-sm:text-xs', classNames?.errorMessage),
      }}
      variant={variant}
      {...props}
    />
  );
}

export function ArrayTextareaField({
  classNames,
  maxArrayLength,
  labelPlacement = 'outside',
  ...props
}: TextareaFieldProps & { maxArrayLength?: number }) {
  const field = useFieldContext<string>();

  return (
    <Textarea
      onValueChange={field.handleChange}
      onBlur={field.handleBlur}
      value={Array.isArray(field.state.value) ? field.state.value.join(', ') : field.state.value}
      isInvalid={!field.state.meta.isValid}
      errorMessage={field.state.meta.errors.map((e) => e.message).join(',')}
      classNames={{
        ...classNames,
        label: cn('text-sm', classNames?.label),
        description: cn('text-sm text-default-500 max-sm:text-xs', classNames?.description),
        errorMessage: cn('text-sm max-sm:text-xs', classNames?.errorMessage),
        innerWrapper: cn('flex-col items-end', classNames?.innerWrapper),
      }}
      endContent={
        maxArrayLength && (
          <span
            className={cn('text-default-500 ml-auto text-sm group-data-[invalid=true]:text-danger')}
          >
            {
              String(field.state.value)
                .split(/,|\n/)
                .map((v) => v.trim())
                .filter((v) => !!v).length
            }
            /{maxArrayLength}
          </span>
        )
      }
      labelPlacement={labelPlacement}
      {...props}
    />
  );
}

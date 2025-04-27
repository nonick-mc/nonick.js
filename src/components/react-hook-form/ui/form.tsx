'use client';

import { Form, type FormProps, cn } from '@heroui/react';
import { type FieldValues, FormProvider, type UseFormReturn } from 'react-hook-form';

export function ControlledForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  form,
  className,
  ...props
}: FormProps & { form: UseFormReturn<TFieldValues, TContext, TTransformedValues> }) {
  return (
    <FormProvider {...form}>
      <Form
        className={cn('flex flex-col gap-6 pb-28', className)}
        validationBehavior='aria'
        {...props}
      />
    </FormProvider>
  );
}

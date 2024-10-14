'use client';

import { cn } from '@nextui-org/theme';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

type FormItemProps = {
  dir?: 'row' | 'col';
  mobileDir?: 'row' | 'col';
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FormItemProps
>(({ className, dir, mobileDir, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn(
          'flex gap-2',
          { 'items-center justify-between': dir === 'row' },
          { 'flex-col': dir === 'col' },
          { 'max-md:items-center max-md:justify-between': mobileDir === 'row' },
          { 'max-md:flex-col max-md:items-stretch max-md:justify-normal': mobileDir === 'col' },
          className,
        )}
        {...props}
      />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

type FormTitleProps = {
  isRequired?: boolean;
};

const FormTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FormTitleProps
>(({ className, isRequired, ...props }, ref) => {
  const { formItemId } = useFormField();

  return (
    <p
      ref={ref}
      id={formItemId}
      className={cn(
        { "text-sm after:content-['*'] after:text-danger after:ml-0.5": isRequired },
        className,
      )}
      {...props}
    />
  );
});

const FormDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn('max-sm:text-xs text-default-500', className)}
        {...props}
      />
    );
  },
);

const FormMessage = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={cn('text-sm text-danger', className)} {...props}>
        {body}
      </p>
    );
  },
);

type FormLabelProps = {
  title: string;
  description?: string;
  isDisabled?: boolean;
  hideError?: boolean;
} & FormTitleProps;

const FormLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FormLabelProps
>(({ title, description, isDisabled, isRequired, hideError }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col max-sm:gap-1 text-sm', { 'opacity-disabled': isDisabled })}
    >
      <FormTitle isRequired={isRequired}>{title}</FormTitle>
      {description && <FormDescription>{description}</FormDescription>}
      {!hideError && <FormMessage />}
    </div>
  );
});

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      aria-labelledby={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};

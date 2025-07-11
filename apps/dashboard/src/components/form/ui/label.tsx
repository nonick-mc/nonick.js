import { cn } from '@heroui/react';
import type { HTMLAttributes, ReactNode } from 'react';

export type FieldLabelProps = {
  label: ReactNode;
  description?: ReactNode;
  isRequired?: boolean;
  isDisabled?: boolean;
};

export function FieldLabel({ label, description, isDisabled, isRequired }: FieldLabelProps) {
  return (
    <div className={cn('flex flex-col max-sm:gap-1', { 'opacity-disabled': isDisabled })}>
      <Label isRequired={isRequired}>{label}</Label>
      {description && <Description>{description}</Description>}
    </div>
  );
}

function Label({
  className,
  isRequired,
  ...props
}: HTMLAttributes<HTMLLabelElement> & { isRequired?: boolean }) {
  return (
    // biome-ignore lint: false
    <label
      className={cn(
        'text-sm',
        { "after:content-['*'] after:text-danger after:ms-0.5": isRequired },
        className,
      )}
      {...props}
    />
  );
}

function Description({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm max-sm:text-xs text-default-500', className)} {...props} />;
}

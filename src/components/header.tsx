import { cn } from '@heroui/theme';
import type React from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

export type HeaderProps = {
  title?: ReactNode;
  titleClass?: string;
  description?: ReactNode;
  descriptionClass?: string;
} & HTMLAttributes<HTMLDivElement>;

export function Header({
  className,
  title,
  titleClass,
  description,
  descriptionClass,
  ...props
}: HeaderProps) {
  return (
    <div className={cn('w-full flex flex-col gap-1', className)} {...props}>
      {title && (
        <h1
          className={cn(
            'text-2xl sm:text-3xl font-extrabold sm:font-black max-sm:text-center',
            titleClass,
          )}
        >
          {title}
        </h1>
      )}
      {description && (
        <p
          className={cn(
            'text-small sm:text-medium text-default-500 leading-tight max-sm:text-center',
            descriptionClass,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

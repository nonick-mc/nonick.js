'use client';

import { cn } from '@heroui/react';
import { type IconProps, Icon as RealIcon } from '@iconify/react';

export function Icon({ className, ...props }: IconProps) {
  return (
    <span
      className={cn('w-[1em] h-[1em] inline-flex items-center justify-center', className)}
      inert
    >
      <RealIcon {...props} />
    </span>
  );
}

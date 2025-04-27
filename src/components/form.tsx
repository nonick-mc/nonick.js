'use client';

import { Card, CardBody, CardHeader } from '@heroui/card';
import { cn } from '@heroui/theme';
import type { ReactNode } from 'react';
import { Icon } from './icon';

export type FormCardProps = {
  title?: ReactNode;
  headerClass?: string;
  bodyClass?: string;
  children: ReactNode;
};

export function FormCard({ title, headerClass, bodyClass, children }: FormCardProps) {
  return (
    <Card className='w-full'>
      {title && (
        <CardHeader className={cn('p-6', headerClass)}>
          <h3 className='text-lg font-semibold'>{title}</h3>
        </CardHeader>
      )}
      <CardBody className={cn('flex flex-col gap-8 p-6', { 'pt-0': title }, bodyClass)}>
        {children}
      </CardBody>
    </Card>
  );
}

export type FormSubCardProps = {
  icon?: string;
  isDisabled?: boolean;
} & FormCardProps;

export function FormSubCard({
  title,
  headerClass,
  bodyClass,
  isDisabled,
  icon,
  children,
}: FormSubCardProps) {
  return (
    <Card className='w-full bg-content2 shadow-none'>
      {title && (
        <CardHeader
          className={cn(
            'flex gap-3 items-center p-5',
            { 'opacity-disabled': isDisabled },
            headerClass,
          )}
        >
          {icon && <Icon icon={icon} className='text-default-500 text-xl' />}
          <h4 className='text-sm font-semibold'>{title}</h4>
        </CardHeader>
      )}
      <CardBody className={cn('flex flex-col gap-6 p-5', { 'pt-0': title }, bodyClass)}>
        {children}
      </CardBody>
    </Card>
  );
}

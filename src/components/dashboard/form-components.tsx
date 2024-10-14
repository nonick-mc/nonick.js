'use client';

import { DevTool } from '@hookform/devtools';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { cn } from '@nextui-org/theme';
import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { IconifyIcon } from '../iconify-icon';

export function FormCard({
  title,
  className,
  children,
}: { title?: string; className?: string; children: ReactNode }) {
  return (
    <Card>
      {title && (
        <CardHeader className='p-6'>
          <h3 className='text-lg font-semibold'>{title}</h3>
        </CardHeader>
      )}
      <CardBody className={cn('flex flex-col gap-8 p-6', { 'pt-0': title }, className)}>
        {children}
      </CardBody>
    </Card>
  );
}

export function FormActionButtons() {
  const { formState, reset } = useFormContext();

  return (
    <div className='flex items-center gap-3 w-full pb-12'>
      <Button
        type='submit'
        color='primary'
        startContent={
          !formState.isSubmitting && (
            <IconifyIcon icon='solar:diskette-bold' className='text-[20px]' />
          )
        }
        isLoading={formState.isSubmitting}
        isDisabled={!formState.isDirty}
      >
        変更を保存
      </Button>
      <Button
        onClick={() => reset()}
        isDisabled={!formState.isDirty || formState.isSubmitting}
        variant='ghost'
      >
        リセット
      </Button>
    </div>
  );
}

export function FormDevTool() {
  if (process.env.NODE_ENV !== 'development') return null;

  const form = useFormContext();
  return <DevTool control={form.control} placement='top-left' />;
}

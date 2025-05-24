'use client';

import { Spinner } from '@heroui/spinner';

export default function Loading() {
  return (
    <div className='flex items-center justify-center w-full'>
      <Spinner variant='spinner' className='mb-[80px]' />
    </div>
  );
}

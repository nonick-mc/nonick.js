'use client';

import { Card } from '@heroui/react';
import { Spinner } from '@heroui/spinner';

export default function Loading() {
  return (
    <Card className='p-8 w-fit'>
      <Spinner variant='spinner' />
    </Card>
  );
}

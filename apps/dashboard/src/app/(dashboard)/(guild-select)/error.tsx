'use client';

import { CircleAlertIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  return (
    <Card className='py-24 flex-col justify-center items-center gap-4 border-destructive text-center'>
      <CircleAlertIcon className='size-8 stroke-destructive' />
      <div className='flex flex-col items-center gap-1'>
        <p className='text-destructive'>データの取得時に予期しない問題が発生しました</p>
        <p className='max-sm:text-sm text-muted-foreground'>{error.message}</p>
      </div>
    </Card>
  );
}

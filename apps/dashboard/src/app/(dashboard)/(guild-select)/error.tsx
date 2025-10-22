'use client';

import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ErrorPage() {
  return (
    <Alert variant='destructive' className='w-full'>
      <AlertCircleIcon className='h-5 w-5' />
      <AlertTitle>エラーが発生しました</AlertTitle>
      <AlertDescription>
        ページの読み込み中に予期しない問題が発生しました。時間をおいて再度アクセスしてください。
      </AlertDescription>
    </Alert>
  );
}

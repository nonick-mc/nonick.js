'use client';

import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  return (
    <Alert variant='destructive'>
      <AlertCircleIcon />
      <AlertTitle>ページの読み込み中に予期しないエラーが発生しました。</AlertTitle>
      <AlertDescription>時間をおいて再度アクセスしてください。({error.message})</AlertDescription>
    </Alert>
  );
}

'use client'; // Error boundaries must be Client Components

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Alert variant='danger'>
      <AlertTitle>エラーが発生しました</AlertTitle>
      <AlertDescription>
        ページの読み込み時に予期しないエラーが発生しました。時間をおいて再読み込みしてください。
      </AlertDescription>
    </Alert>
  );
}

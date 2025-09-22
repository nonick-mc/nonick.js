'use client';

import { CircleAlertIcon } from 'lucide-react';
import { Alert, AlertContent, AlertIcon, AlertTitle } from '@/components/ui/alert';

export default function ErrorPage() {
  return (
    <Alert variant='destructive' appearance='light'>
      <AlertIcon>
        <CircleAlertIcon />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>
          ページの読み込み中に予期しない問題が発生しました。時間をおいて再度お試しください。
        </AlertTitle>
      </AlertContent>
    </Alert>
  );
}

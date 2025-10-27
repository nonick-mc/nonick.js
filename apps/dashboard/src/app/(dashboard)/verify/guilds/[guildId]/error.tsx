'use client';

import { CircleAlertIcon } from 'lucide-react';
import { Logo } from '@/components/logo';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function ErrorPage() {
  return (
    <>
      <CardHeader className='gap-6'>
        <Logo height={16} />
        <div className='flex flex-col gap-1'>
          <CardTitle className='text-xl font-extrabold'>メンバー認証</CardTitle>
          <CardDescription>Discordアカウントで認証を行います。</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Empty className='px-0 md:px-0'>
          <EmptyHeader>
            <EmptyMedia className='bg-destructive/10' variant='icon'>
              <CircleAlertIcon className='stroke-destructive' />
            </EmptyMedia>
            <EmptyTitle>問題が発生しました</EmptyTitle>
            <EmptyDescription>
              ページの読み込み中に予期しない問題が発生しました。時間をおいて再度アクセスしてください。
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </>
  );
}

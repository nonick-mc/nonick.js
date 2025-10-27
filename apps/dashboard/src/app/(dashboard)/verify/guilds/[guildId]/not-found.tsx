import { LockIcon } from 'lucide-react';
import { Logo } from '@/components/logo';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function NotFound() {
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
            <EmptyMedia variant='icon'>
              <LockIcon />
            </EmptyMedia>
            <EmptyTitle>認証を行うことができません</EmptyTitle>
            <EmptyDescription>
              サーバーが存在しないか、認証を行うためのアクセス権限がありません。
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    </>
  );
}

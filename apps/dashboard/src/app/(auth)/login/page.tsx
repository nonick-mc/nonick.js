import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoginButton } from './login-button';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function Page() {
  return (
    <div className='min-h-dvh flex items-center justify-center'>
      <Card className='w-[400px] px-6 py-8 items-center'>
        <Logo height={18} />
        <p className='text-xl font-bold'>ログインして続行</p>
        <div className='w-full flex flex-col gap-2'>
          <Suspense>
            <LoginButton />
          </Suspense>
          <Button variant='secondary' asChild>
            <Link href='https://docs.nonick-js.com/tutorial/introduction'>ログインについて</Link>
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>
          ログインすることで、NoNICK.jsの
          <Button variant='link' className='p-0 px-1 h-auto' asChild>
            <Link href='https://nonick-js.com/tos'>利用規約</Link>
          </Button>
          および
          <Button variant='link' className='p-0 px-1 h-auto' asChild>
            <Link href='https://nonick-js.com/privacy-policy'>プライバシーポリシー</Link>
          </Button>
          に同意したとみなされます。
        </p>
      </Card>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoginButton } from './login-button';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function Page() {
  return (
    <div className='w-full h-dvh flex flex-col gap-6 items-center justify-center'>
      <Logo height={24} />
      <Card className='max-w-[420px] w-full py-8'>
        <CardHeader className='text-center'>
          <CardTitle className='font-black text-xl'>ログイン</CardTitle>
          <CardDescription>Discordアカウントを使用して続行</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-2'>
          <Suspense>
            <LoginButton />
          </Suspense>
          <Button variant='secondary' className='w-full' asChild>
            <Link href='https://docs.nonick-js.com/tutorial/dashboard'>ログインについて</Link>
          </Button>
        </CardContent>
      </Card>
      <div className='flex gap-3'>
        <Button variant='link' size='text' asChild>
          <Link href='https://nonick-js.com/tos'>利用規約</Link>
        </Button>
        <Separator className='h-full' orientation='vertical' />
        <Button variant='link' size='text' asChild>
          <Link href='https://nonick-js.com/privacy-policy'>プライバシーポリシー</Link>
        </Button>
      </div>
    </div>
  );
}

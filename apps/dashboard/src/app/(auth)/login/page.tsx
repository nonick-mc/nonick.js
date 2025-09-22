import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { LogoIcon } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LoginButton } from './login-button';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function Page() {
  return (
    <div className='w-full h-dvh flex flex-col gap-6 items-center justify-center'>
      <Card className='max-w-[420px] w-full'>
        <div className='flex flex-col items-center gap-6 p-8'>
          <div className='bg-accent border size-[80px] rounded-full flex items-center justify-center'>
            <LogoIcon width={40} height={40} />
          </div>
          <div className='text-center'>
            <p className='font-extrabold text-xl'>ログイン</p>
            <p className='text-muted-foreground text-sm'>Discordアカウントを使用して続行</p>
          </div>
          <div className='w-full flex flex-col gap-2'>
            <Suspense>
              <LoginButton />
            </Suspense>
            <Button variant='secondary' className='w-full' size='lg' asChild>
              <Link href='https://docs.nonick-js.com/tutorial/dashboard'>ログインについて</Link>
            </Button>
          </div>
        </div>
      </Card>
      <div className='flex gap-3'>
        <Button mode='link' underlined='solid'>
          <Link href='https://nonick-js.com/tos'>利用規約</Link>
        </Button>
        <Separator className='h-full' orientation='vertical' />
        <Button mode='link' underlined='solid' asChild>
          <Link href='https://nonick-js.com/privacy-policy'>プライバシーポリシー</Link>
        </Button>
      </div>
    </div>
  );
}

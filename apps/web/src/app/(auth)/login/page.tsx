import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginButton } from './login-button';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function Page() {
  return (
    <main className='flex flex-col min-h-dvh items-center justify-center p-6 gap-10'>
      <Logo height={24} />
      <Card className='max-w-sm w-full'>
        <CardHeader className='text-center'>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>Discordアカウントを使用して続行</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-3'>
          <Suspense>
            <LoginButton />
          </Suspense>
          <Button
            size='lg'
            variant='secondary'
            render={<Link href='/docs/tutorial/introduction'>ログインについて</Link>}
            nativeButton={false}
          />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground w-full text-center text-xs'>
            ログインすることで、NoNICK.jsの{' '}
            <Link
              href='/tos'
              className='transition-colors hover:text-foreground underline underline-offset-4'
            >
              利用規約
            </Link>{' '}
            および{' '}
            <Link
              href='/privacy-policy'
              className='transition-colors hover:text-foreground underline underline-offset-4'
            >
              プライバシーポリシー
            </Link>{' '}
            に同意したとみなされます。
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}

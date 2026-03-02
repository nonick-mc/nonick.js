import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Logo } from '@/components/logo';
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
    <div className='mx-auto grid w-full max-w-md min-w-0 min-h-screen content-center p-6'>
      <div className='flex flex-col items-center justify-center gap-8'>
        <Logo height={20} />
        <Card>
          <CardHeader className='text-center'>
            <CardTitle>ログイン</CardTitle>
            <CardDescription>Discordアカウントを使用して続行</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <LoginButton />
            </Suspense>
          </CardContent>
          <CardFooter>
            <p className='text-muted-foreground w-full text-center text-xs'>
              ログインすることで、NoNICK.jsの{' '}
              <Link
                href='/tos'
                className='hover:text-muted-foreground/80 underline underline-offset-3 transition-colors'
              >
                利用規約
              </Link>{' '}
              および{' '}
              <Link
                href='/privacy-policy'
                className='hover:text-muted-foreground/80 underline underline-offset-3 transition-colors'
              >
                プライバシーポリシー
              </Link>{' '}
              に同意したとみなされます。
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

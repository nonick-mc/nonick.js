import { signIn } from '@/auth';
import { IconifyIcon } from '@/components/iconify-icon';
import { Logo } from '@/components/logo';
import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Link } from '@nextui-org/link';
import type { Metadata } from 'next';
import NextLink from 'next/link';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function Page({
  searchParams: { callbackUrl },
}: { searchParams: { callbackUrl?: string } }) {
  return (
    <div className='container h-dvh flex items-center justify-center'>
      <Card className='max-w-[400px] flex flex-col gap-6 px-6 py-8'>
        <Logo width={130} />
        <div>
          <p className='text-xl font-medium'>ログインが必要です</p>
          <p className='text-sm text-default-500'>Discordアカウントを使用して続行</p>
        </div>
        <form
          className='flex flex-col gap-3'
          action={async () => {
            'use server';
            await signIn('discord', { redirectTo: callbackUrl || '/' });
          }}
        >
          <Button
            type='submit'
            color='primary'
            startContent={<IconifyIcon icon='ic:baseline-discord' className='text-[20px]' />}
            fullWidth
            disableRipple
          >
            Discordでログイン
          </Button>
          <Button
            as={NextLink}
            href='https://docs.nonick-js.com/nonick-js/how-to-login'
            variant='flat'
            fullWidth
            disableRipple
          >
            ログインについて
          </Button>
        </form>
        <p className='text-sm leading-none text-default-500'>
          ログインすることで、NoNICK.jsの
          <Link
            size='sm'
            href='https://docs.nonick-js.com/important/teams-of-service/'
            isExternal
            showAnchorIcon
          >
            利用規約
          </Link>
          および
          <Link
            size='sm'
            href='https://docs.nonick-js.com/important/privacy-policy'
            isExternal
            showAnchorIcon
          >
            プライバシーポリシー
          </Link>
          に同意したとみなされます。
        </p>
      </Card>
    </div>
  );
}

import { Icon } from '@/components/icon';
import { Logo } from '@/components/logo';
import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { Link } from '@heroui/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginButton } from './login-button';

export const metadata: Metadata = {
  title: 'ログイン',
};

export default function Page() {
  return (
    <div className='container h-dvh flex items-center justify-center'>
      <Card className='max-w-[400px] flex flex-col gap-6 px-6 py-8'>
        <Logo width={110} />
        <div>
          <p className='text-xl pb-1 font-extrabold'>ログイン</p>
          <p className='text-sm text-default-500'>Discordアカウントを使用して続行</p>
        </div>
        <div className='flex flex-col gap-3'>
          <Suspense
            fallback={
              <Button
                color='primary'
                startContent={<Icon icon='ic:baseline-discord' className='text-2xl' />}
                isDisabled
                fullWidth
              >
                Discordでログイン
              </Button>
            }
          >
            <LoginButton />
          </Suspense>
          <Button
            as={Link}
            href='https://docs.nonick-js.com/tutorial/how-to-setting/'
            variant='flat'
            fullWidth
            disableRipple
          >
            ログインについて
          </Button>
        </div>
        <p className='text-sm leading-none text-default-500'>
          ログインすることで、NoNICK.jsの
          <Link size='sm' href='https://nonick-js.com/tos' isExternal showAnchorIcon>
            利用規約
          </Link>
          および
          <Link size='sm' href='https://nonick-js.com/privacy-policy' isExternal showAnchorIcon>
            プライバシーポリシー
          </Link>
          に同意したとみなされます。
        </p>
      </Card>
    </div>
  );
}

'use client';

import { Icon } from '@/components/icon';
import { Alert, Button } from '@heroui/react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function SessionAlert() {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Alert
      classNames={{
        base: 'flex-col gap-6 items-center py-8',
        iconWrapper: 'w-[60px] h-[60px]',
        alertIcon: 'h-10 w-10',
        mainWrapper: 'text-center ms-0',
        title: 'text-md',
      }}
      title='セッションの有効期限が切れました'
      description='ダッシュボードを使用するには再度ログインを行う必要があります。'
      color='warning'
      variant='faded'
      endContent={
        <Button
          onPress={() => {
            setIsPressed(true);
            signIn('discord');
          }}
          color='warning'
          className='flex-shrink-0'
          startContent={
            !isPressed && (
              <Icon icon='solar:arrow-right-linear' className='text-2xl text-warning-500' />
            )
          }
          isLoading={isPressed}
          variant='flat'
        >
          ログイン
        </Button>
      }
    />
  );
}

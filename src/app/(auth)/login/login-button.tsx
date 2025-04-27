'use client';

import { Icon } from '@/components/icon';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/spinner';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function LoginButton() {
  const [isPressed, setIsPressed] = useState(false);
  const searchParams = useSearchParams();

  return (
    <Button
      onPress={async () => {
        setIsPressed(true);
        signIn('discord', {
          redirectTo: searchParams.get('callbackUrl') || '/',
        });
      }}
      color='primary'
      startContent={!isPressed && <Icon icon='ic:baseline-discord' className='text-2xl' />}
      isLoading={isPressed}
      spinner={<Spinner variant='spinner' size='sm' color='white' />}
      fullWidth
      disableRipple
    >
      Discordでログイン
    </Button>
  );
}

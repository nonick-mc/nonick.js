'use client';

import { SiDiscord } from '@icons-pack/react-simple-icons';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';

export function LoginButton() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      onClick={async () => {
        setIsLoading(true);
        await authClient.signIn.social({
          provider: 'discord',
          callbackURL: searchParams.get('next') ?? '/',
        });
      }}
      disabled={isLoading}
    >
      {isLoading ? <Spinner className='pt-0' /> : <SiDiscord className='size-5' />}
      Discordでログイン
    </Button>
  );
}

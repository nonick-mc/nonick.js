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
          callbackURL: searchParams.get('next') ?? '/dashboard',
        });
      }}
      className='w-full'
      size='lg'
      disabled={isLoading}
    >
      <div className='pt-0.5'>{isLoading ? <Spinner /> : <SiDiscord />}</div>
      {isLoading ? 'リダイレクト中...' : 'Discordでログイン'}
    </Button>
  );
}

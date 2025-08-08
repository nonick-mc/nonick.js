'use client';

import { SiDiscord } from '@icons-pack/react-simple-icons';
import { Loader2Icon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  return (
    <Button
      className='w-full'
      onClick={async () => {
        setIsLoading(true);
        await authClient.signIn.social({
          provider: 'discord',
          callbackURL: searchParams.get('callbackUrl') ?? '/',
        });
      }}
      disabled={isLoading}
    >
      {isLoading ? <Loader2Icon className='animate-spin' /> : <SiDiscord />}
      Discordでログイン
    </Button>
  );
}

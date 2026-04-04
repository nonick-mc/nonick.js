'use client';

import { SiDiscord } from '@icons-pack/react-simple-icons';
import { useSearchParams } from 'next/navigation';
import { useBoolean } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';

export function LoginButton() {
  const searchParams = useSearchParams();
  const { value, setTrue } = useBoolean(false);

  return (
    <Button
      onClick={async () => {
        setTrue();
        await authClient.signIn.social({
          provider: 'discord',
          callbackURL: searchParams.get('next') ?? '/',
        });
      }}
      size='lg'
      disabled={value}
    >
      <div className='pt-0.5'>{value ? <Spinner /> : <SiDiscord />}</div>
      {value ? 'リダイレクト中...' : 'Discordでログイン'}
    </Button>
  );
}

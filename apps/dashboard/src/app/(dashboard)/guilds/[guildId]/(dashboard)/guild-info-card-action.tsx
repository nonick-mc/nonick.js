'use client';

import { Button } from '@repo/ui/components/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';

export function GuildInfoCardAction() {
  const { guildId } = useParams<Awaited<PageProps<'/guilds/[guildId]'>['params']>>();
  const [_, copy] = useCopyToClipboard();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleCopy = async () => {
    setIsDisabled(true);
    await copy(guildId);
    toast.success('サーバーIDをコピーしました');
    setTimeout(() => {
      setIsDisabled(false);
    }, 3000);
  };

  return (
    <Button variant='outline' onClick={handleCopy} disabled={isDisabled}>
      {isDisabled ? <CheckIcon /> : <CopyIcon />}
      <span className='hidden sm:block'>サーバーIDをコピー</span>
    </Button>
  );
}

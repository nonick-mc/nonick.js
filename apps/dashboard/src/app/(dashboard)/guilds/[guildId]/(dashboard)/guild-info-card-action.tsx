'use client';

import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { CopyIcon, EllipsisIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCopyToClipboard } from 'usehooks-ts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function GuildInfoCardAction() {
  const { guildId } = useParams<Awaited<PageProps<'/guilds/[guildId]'>['params']>>();
  const [_, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    await copy(guildId);
    toast.success('サーバーIDをコピーしました');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={handleCopy}>
          <CopyIcon />
          サーバーIDをコピー
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

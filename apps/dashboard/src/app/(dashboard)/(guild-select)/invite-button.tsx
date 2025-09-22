import { CirclePlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { inviteUrl } from '@/lib/discord/api';

export function InviteButton() {
  return (
    <Button size='lg' asChild>
      <Link href={inviteUrl}>
        <CirclePlusIcon />
        サーバーを追加
      </Link>
    </Button>
  );
}

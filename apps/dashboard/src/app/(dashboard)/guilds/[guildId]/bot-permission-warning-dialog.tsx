'use client';

import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/dialog';
import { SidebarMenuButton, SidebarMenuItem } from '@repo/ui/components/sidebar';
import { ExternalLinkIcon, TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { createInviteBotUrl } from '@/lib/discord/constants';

type BotPermissionWarningDialogProps = {
  guildId: string;
};

export function BotPermissionWarningDialog({ guildId }: BotPermissionWarningDialogProps) {
  const inviteUrl = createInviteBotUrl(guildId);

  return (
    <Dialog>
      <SidebarMenuItem>
        <DialogTrigger asChild>
          <SidebarMenuButton
            tooltip='Botの権限が不足しています'
            className='text-destructive hover:text-destructive'
          >
            <TriangleAlertIcon />
            <span>権限が不足しています</span>
          </SidebarMenuButton>
        </DialogTrigger>
      </SidebarMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Botの権限が不足しています</DialogTitle>
          <DialogDescription>
            このサーバーに導入されているBotの権限が、ダッシュボードの動作に必要な権限を満たしていません。
            一部の機能が正しく動作しない可能性があります。
          </DialogDescription>
        </DialogHeader>
        <p className='text-sm text-muted-foreground'>
          「更新」を押してDiscordの認可画面を開き、不足している権限を付与してください。
        </p>
        <DialogFooter>
          <Button asChild>
            <Link href={inviteUrl} target='_blank' rel='noopener noreferrer'>
              更新
              <ExternalLinkIcon className='size-4' />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

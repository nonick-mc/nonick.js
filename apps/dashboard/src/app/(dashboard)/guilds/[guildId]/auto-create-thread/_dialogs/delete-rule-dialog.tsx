'use client';

import type { autoCreateThreadRule } from '@repo/database';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/alert-dialog';
import { Button } from '@repo/ui/components/button';
import { Spinner } from '@repo/ui/components/spinner';
import type { InferSelectModel } from 'drizzle-orm';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteRuleAction } from '../action';

type DeleteRuleDialogProps = {
  targetChannelName: string;
  rule: InferSelectModel<typeof autoCreateThreadRule>;
};

export function DeleteRuleDialog({ targetChannelName, rule }: DeleteRuleDialogProps) {
  const bindDeleteRuleAction = deleteRuleAction.bind(null, rule.guildId, rule.channelId);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleAction() {
    setIsLoading(true);
    const res = await bindDeleteRuleAction();
    setIsLoading(false);
    if (res.serverError || res.validationErrors) {
      return toast.error('チャンネルの削除に失敗しました。');
    }
    setOpen(false);
    toast.success('チャンネルを削除しました。');
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className='text-destructive enabled:hover:text-destructive'
          variant='outline'
          size='icon'
        >
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>設定を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            設定からチャンネル<span className='font-extrabold'>「#{targetChannelName}」</span>
            を削除しますか？この操作は元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>キャンセル</AlertDialogCancel>
          <Button onClick={handleAction} variant='destructive' disabled={isLoading}>
            {isLoading ? <Spinner /> : <Trash2Icon />}
            削除
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

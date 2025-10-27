'use client';

import type { auditLog, user } from '@repo/database';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import 'dayjs/locale/ja';
import type { InferSelectModel } from 'drizzle-orm';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

dayjs.locale('ja');
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export const targetNameTexts: Record<InferSelectModel<typeof auditLog>['targetName'], string> = {
  join_message: '入室メッセージ',
  leave_message: '退室メッセージ',
  report: 'サーバー内通報',
  timeout_log: 'タイムアウトログ',
  kick_log: 'キックログ',
  ban_log: 'BANログ',
  voice_log: 'ボイスチャンネルログ',
  message_delete_log: 'メッセージ削除ログ',
  message_edit_log: 'メッセージ編集ログ',
  message_expand: 'メッセージURL展開',
  auto_change_verify_level: '自動認証レベル変更',
  auto_public: '自動アナウンス公開',
  auto_create_thread: '自動スレッド作成',
  auto_mod: 'AutoMod Plus',
  guild: 'サーバー',
  verification: 'メンバー認証',
};

export const actionTypeTexts: Record<InferSelectModel<typeof auditLog>['actionType'], string> = {
  update_guild_setting: '設定に変更を加えました',
};

export type CustomizedAuditLog = Omit<InferSelectModel<typeof auditLog>, 'authorId'> & {
  author: Pick<InferSelectModel<typeof user>, 'name' | 'globalName' | 'image'> | null;
};

export const colums: ColumnDef<CustomizedAuditLog>[] = [
  {
    accessorKey: 'author',
    header: 'ユーザー',
    cell: ({ row }) => {
      const author = row.getValue<CustomizedAuditLog['author']>('author');
      if (!author) return null;

      return (
        <div className='flex items-center gap-2'>
          <Avatar className='size-7'>
            <AvatarImage src={author.image ?? undefined} />
            <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className='text-sm'>{author.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'targetName',
    header: '対象',
    cell: ({ row }) => {
      return (
        <span>
          {targetNameTexts[row.getValue<CustomizedAuditLog['targetName']>('targetName')] ??
            '不明なターゲット'}
        </span>
      );
    },
  },
  {
    accessorKey: 'actionType',
    header: 'アクション',
    cell: ({ row }) => {
      return (
        <span>
          {actionTypeTexts[row.getValue<CustomizedAuditLog['actionType']>('actionType')] ??
            '不明なアクション'}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: '実行日時',
    cell: ({ row }) => {
      const createdAt = row.getValue<CustomizedAuditLog['createdAt']>('createdAt');
      const now = dayjs();
      const diffDays = now.diff(dayjs(createdAt), 'day');

      if (diffDays >= 1) {
        return <span>{dayjs(createdAt).tz().format('YYYY/MM/DD HH:mm')}</span>;
      }

      return (
        <Tooltip>
          <TooltipTrigger className='mr-auto'>{dayjs(createdAt).tz().fromNow()}</TooltipTrigger>
          <TooltipContent>{dayjs(createdAt).tz().format('YYYY/MM/DD HH:mm')}</TooltipContent>
        </Tooltip>
      );
    },
  },
];

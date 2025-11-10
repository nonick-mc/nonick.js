import { Badge } from '@repo/ui/components/badge';
import {
  ClipboardListIcon,
  FlagIcon,
  HammerIcon,
  LayoutGridIcon,
  Link2Icon,
  LogInIcon,
  LogOutIcon,
  LogsIcon,
  type LucideIcon,
  MegaphoneIcon,
  ScanQrCodeIcon,
  ShieldCheckIcon,
  SpoolIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

type SidebarGroupItem<T> = {
  title: string;
  items: SidebarItem<T>[];
};

type SidebarItem<T> = {
  title: string;
  key?: string;
  url: (arg: T) => string;
  badge?: ReactNode;
  icon: LucideIcon;
  subitems?: SidebarSubItem[];
};

type SidebarSubItem = {
  title: string;
  key?: string;
  badge?: ReactNode;
};

export const SidebarNavigationItems: SidebarGroupItem<string>[] = [
  {
    title: '管理',
    items: [
      {
        title: 'ダッシュボード',
        url: (guildId) => `/guilds/${guildId}`,
        icon: LayoutGridIcon,
      },
      {
        key: 'audit-log',
        title: '監査ログ',
        url: (guildId) => `/guilds/${guildId}/audit-log`,
        icon: LogsIcon,
        badge: <Badge variant='secondary'>Beta</Badge>,
      },
    ],
  },
  {
    title: '機能',
    items: [
      {
        key: 'join-message',
        title: '入室メッセージ',
        url: (guildId) => `/guilds/${guildId}/join-message`,
        icon: LogInIcon,
      },
      {
        key: 'leave-message',
        title: '退室メッセージ',
        url: (guildId) => `/guilds/${guildId}/leave-message`,
        icon: LogOutIcon,
      },
      {
        key: 'report',
        title: 'サーバー内通報',
        url: (guildId) => `/guilds/${guildId}/report`,
        icon: FlagIcon,
      },
      {
        key: 'event-log',
        title: 'イベントログ',
        url: (guildId) => `/guilds/${guildId}/event-log`,
        icon: ClipboardListIcon,
        subitems: [
          {
            title: 'タイムアウト',
            key: 'timeout',
          },
          {
            title: 'キック',
            key: 'kick',
          },
          {
            title: 'BAN',
            key: 'ban',
          },
          {
            title: 'ボイスチャット',
            key: 'voice',
          },
          {
            title: 'メッセージ削除',
            key: 'message-delete',
          },
          {
            title: 'メッセージ編集',
            key: 'message-edit',
          },
        ],
      },
      {
        key: 'message-expand',
        title: 'メッセージURL展開',
        url: (guildId) => `/guilds/${guildId}/message-expand`,
        icon: Link2Icon,
      },
      {
        key: 'auto-change-verification-level',
        title: '自動認証レベル変更',
        url: (guildId) => `/guilds/${guildId}/auto-change-verification-level`,
        icon: ShieldCheckIcon,
      },
      {
        key: 'auto-public',
        title: '自動アナウンス公開',
        url: (guildId) => `/guilds/${guildId}/auto-public`,
        icon: MegaphoneIcon,
      },
      {
        key: 'auto-create-thread',
        title: '自動スレッド作成',
        url: (guildId) => `/guilds/${guildId}/auto-create-thread`,
        icon: SpoolIcon,
        badge: <Badge variant='secondary'>Updated</Badge>,
      },
      {
        key: 'automod-plus',
        title: 'AutoMod Plus',
        url: (guildId) => `/guilds/${guildId}/automod-plus`,
        icon: HammerIcon,
      },
      {
        key: 'verification',
        title: 'メンバー認証',
        url: (guildId) => `/guilds/${guildId}/verification`,
        icon: ScanQrCodeIcon,
      },
    ],
  },
];

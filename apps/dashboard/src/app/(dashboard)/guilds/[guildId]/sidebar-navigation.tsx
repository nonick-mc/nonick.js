'use client';

import {
  ClipboardListIcon,
  FlagIcon,
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
import type { Route } from 'next';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

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
};

const items: SidebarGroupItem<string>[] = [
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
        key: 'automod-plus',
        title: '自動スレッド作成',
        url: (guildId) => `/guilds/${guildId}/automod-plus`,
        icon: SpoolIcon,
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

export function SidebarNavigation() {
  const params = useParams<{ guildId: string }>();
  const pathname = usePathname();
  const currentPath = pathname.split('/')?.[3] as string | undefined;

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={currentPath === item.key}>
                    <Link href={item.url(params.guildId) as Route}>
                      <item.icon className='pt-0.5' />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

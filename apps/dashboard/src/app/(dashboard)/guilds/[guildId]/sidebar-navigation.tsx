'use client';

import {
  ChevronRightIcon,
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
import type { Route } from 'next';
import Link from 'next/link';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
  subitems?: SidebarSubItem[];
};

type SidebarSubItem = {
  title: string;
  key?: string;
  badge?: ReactNode;
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

export function SidebarNavigation() {
  const params = useParams<{ guildId: string }>();
  const segments = useSelectedLayoutSegments().filter((s) => !s.startsWith('('));

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subitems?.length ? (
                    <Collapsible
                      defaultOpen={segments[0] === item.key}
                      className='group/collapsible'
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon className='text-muted-foreground' />
                          {item.title}
                          <ChevronRightIcon className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subitems.map((subitem) => (
                            <SidebarMenuSubItem key={subitem.key}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={segments[0] === item.key && segments[1] === subitem.key}
                              >
                                <Link href={`${item.url(params.guildId)}/${subitem.key}` as Route}>
                                  {subitem.title}
                                </Link>
                              </SidebarMenuSubButton>
                              {subitem.badge && (
                                <SidebarMenuBadge>{subitem.badge}</SidebarMenuBadge>
                              )}
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <>
                      <SidebarMenuButton asChild isActive={segments[0] === item.key}>
                        <Link href={item.url(params.guildId) as Route}>
                          <item.icon className='text-muted-foreground' />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                    </>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}

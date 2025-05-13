import type { SidebarItem } from '@/components/sidebar-navigation';
import { Chip } from '@heroui/chip';

export const sectionItems: SidebarItem<{ guildId: string }>[] = [
  {
    key: 'management',
    title: '管理',
    items: [
      {
        key: 'dashboard',
        href: (param) => `/guilds/${param.guildId}`,
        icon: 'solar:widget-2-outline',
        title: 'ダッシュボード',
      },
      {
        key: 'audit-log',
        href: (param) => `/guilds/${param.guildId}/audit-log`,
        icon: 'solar:sort-by-time-outline',
        title: '監査ログ',
        endContent: (
          <Chip size='sm' color='primary' variant='flat'>
            Beta
          </Chip>
        ),
      },
    ],
  },
  {
    key: 'features',
    title: '機能',
    items: [
      {
        key: 'join-message',
        href: (param) => `/guilds/${param.guildId}/join-message`,
        icon: 'solar:user-plus-rounded-outline',
        title: '入室メッセージ',
      },
      {
        key: 'leave-message',
        href: (param) => `/guilds/${param.guildId}/leave-message`,
        icon: 'solar:user-minus-rounded-outline',
        title: '退室メッセージ',
      },
      {
        key: 'report',
        href: (param) => `/guilds/${param.guildId}/report`,
        icon: 'solar:flag-outline',
        title: 'サーバー内通報',
      },
      {
        key: 'event-log',
        href: (param) => `/guilds/${param.guildId}/event-log`,
        icon: 'solar:clipboard-list-outline',
        title: 'イベントログ',
      },
      {
        key: 'message-expand',
        href: (param) => `/guilds/${param.guildId}/message-expand`,
        icon: 'solar:link-round-outline',
        title: 'メッセージURL展開',
      },
      {
        key: 'auto-change-verification-level',
        href: (param) => `/guilds/${param.guildId}/auto-change-verification-level`,
        icon: 'solar:shield-check-outline',
        title: '自動認証レベル変更',
      },
      {
        key: 'auto-public',
        href: (param) => `/guilds/${param.guildId}/auto-public`,
        icon: 'solar:mailbox-outline',
        title: '自動アナウンス公開',
      },
      {
        key: 'auto-create-thread',
        href: (param) => `/guilds/${param.guildId}/auto-create-thread`,
        icon: 'solar:hashtag-chat-outline',
        title: '自動スレッド作成',
      },
      {
        key: 'automod-plus',
        href: (param) => `/guilds/${param.guildId}/automod-plus`,
        icon: 'solar:sledgehammer-outline',
        title: 'AutoMod Plus',
      },
    ],
  },
];

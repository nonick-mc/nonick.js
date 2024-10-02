import type { DashboardConfigType } from '@/types/config';

const DashboardConfig: DashboardConfigType = {
  navigation: [
    {
      key: 'none-category',
      items: [
        {
          label: 'ダッシュボード',
          icon: 'solar:widget-5-bold',
          segment: null,
        },
        {
          label: '監査ログ',
          icon: 'solar:history-bold',
          segment: 'audit-log',
        },
      ],
    },
    {
      label: '機能',
      key: 'features',
      items: [
        {
          label: '入室メッセージ',
          icon: 'solar:users-group-rounded-bold',
          segment: 'join-message',
        },
        {
          label: '退室メッセージ',
          icon: 'solar:users-group-rounded-bold',
          segment: 'leave-message',
        },
        {
          label: 'サーバー内通報',
          icon: 'solar:flag-bold',
          segment: 'report',
        },
        {
          label: 'イベントログ',
          icon: 'solar:clipboard-list-bold',
          segment: 'event-log',
        },
        {
          label: 'メッセージURL展開',
          icon: 'solar:link-round-bold',
          segment: 'message-expand',
        },
        {
          label: '自動認証レベル変更',
          icon: 'solar:shield-check-bold',
          segment: 'auto-change-verification-level',
        },
        {
          label: '自動アナウンス公開',
          icon: 'solar:mailbox-bold',
          segment: 'auto-public',
        },
        {
          label: '自動スレッド作成',
          icon: 'solar:hashtag-chat-bold',
          segment: 'auto-create-thread',
          chipLabel: 'New',
        },
        {
          label: 'AutoMod Plus',
          icon: 'solar:sledgehammer-bold',
          segment: 'automod-plus',
        },
      ],
    },
  ],
};

export default DashboardConfig;

import type { auditLog } from '@/lib/database/src/schema/audit-log';

export type AuditLogActionType = (typeof auditLog.$inferSelect)['actionType'];
export type AuditLogTargetName = (typeof auditLog.$inferSelect)['targetName'];

export const targetNameTexts: Record<AuditLogTargetName, string> = {
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

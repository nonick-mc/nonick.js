import { jsonb, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../utils/drizzle';
import { guild } from './guild';

const actionType = ['update_guild_setting'] as const;

const targetName = [
  // guild.ts
  'guild',
  // setting.ts
  'join_message',
  'leave_message',
  'report',
  'timeout_log',
  'kick_log',
  'ban_log',
  'voice_log',
  'message_delete_log',
  'message_edit_log',
  'message_expand',
  'auto_change_verify_level',
  'auto_public',
  'auto_create_thread',
  'auto_mod',
] as const;

export const actionTypeEnum = pgEnum('action_type', actionType);
export const targetNameEnum = pgEnum('target_name', targetName);

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  guildId: text('guild_id').references(() => guild.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull(),
  targetName: targetNameEnum('target_name').notNull(),
  actionType: actionTypeEnum('action_type').notNull(),
  oldValue: jsonb('old_value').$type<unknown>(),
  newValue: jsonb('new_value').$type<unknown>(),
  createdAt: timestamps.createdAt,
});

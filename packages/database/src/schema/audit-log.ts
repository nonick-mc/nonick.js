import { relations } from 'drizzle-orm';
import { jsonb, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../utils.js';
import { user } from './auth.js';
import { guild } from './guild.js';

const actionType = ['update_guild_setting', 'create_rule', 'update_rule', 'delete_rule'] as const;

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
  'verification',
] as const;

export const actionTypeEnum = pgEnum('action_type', actionType);
export const targetNameEnum = pgEnum('target_name', targetName);

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  guildId: text('guild_id')
    .references(() => guild.id, { onDelete: 'cascade' })
    .notNull(),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
  targetName: targetNameEnum('target_name').notNull(),
  actionType: actionTypeEnum('action_type').notNull(),
  before: jsonb('before').$type<unknown>(),
  after: jsonb('after').$type<unknown>(),
  createdAt: timestamps.createdAt,
});

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  author: one(user, {
    fields: [auditLog.authorId],
    references: [user.id],
  }),
}));

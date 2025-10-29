import { boolean, integer, pgSchema, primaryKey, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../utils';
import { guild } from './guild';

export const ruleSchema = pgSchema('public_rule');

const guildId = text('guild_id')
  .notNull()
  .references(() => guild.id, { onDelete: 'cascade' });

export const autoCreateThreadRule = ruleSchema.table(
  'auto_create_thread',
  {
    guildId,
    enabled: boolean('enabled').notNull().default(true),
    channelId: text('channel_id').notNull(),
    threadName: text('thread_name').notNull(),
    autoArchiveDuration: integer('auto_archive_duration').notNull(),
    ignoreRoles: text('ignore_roles').array().notNull(),
    ignoreBot: boolean('ignore_bot').notNull(),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.guildId, table.channelId] })],
);

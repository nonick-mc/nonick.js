import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../utils';
import { guild } from './guild';

export const levels = pgTable(
  'levels',
  {
    userId: text('user_id').notNull(),
    guildId: text('guild_id').references(() => guild.id, { onDelete: 'cascade' }),
    level: integer().notNull().default(0),
    xp: integer().notNull().default(0),
    boost: integer('boost').notNull().default(1),
    ...timestamps,
  },
  (table) => [primaryKey({ columns: [table.userId, table.guildId] })],
);

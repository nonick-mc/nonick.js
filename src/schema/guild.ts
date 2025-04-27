import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from '../lib/drizzle';
import { timestamps } from '../utils/drizzle';

export const guild = pgTable('guild', {
  id: text('id').primaryKey(),
  locale: text('locale').default('ja').notNull(),
  beforeVerifyLevel: integer('before_verify_level'),
  ...timestamps,
});

export const guildSchema = {
  db: createInsertSchema(guild),
  form: createInsertSchema(guild).pick({
    locale: true,
  }),
};

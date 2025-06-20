﻿import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { timestamps } from '../utils';

export const guild = pgTable('guild', {
  id: text('id').primaryKey(),
  locale: text('locale').default('ja').notNull(),
  beforeVerifyLevel: integer('before_verify_level'),
  ...timestamps,
});

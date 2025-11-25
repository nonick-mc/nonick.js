import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('create_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(() => new Date()),
};

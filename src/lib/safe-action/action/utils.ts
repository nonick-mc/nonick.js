import 'server-only';

import type { auditLog } from '@/lib/database/src/schema/audit-log';
import { db } from '@/lib/drizzle';
import { eq } from 'drizzle-orm';
import type { PgColumn, PgTable } from 'drizzle-orm/pg-core';
import type { ZodSchema, z } from 'zod';

export type AuditLogMetadata = {
  targetName: (typeof auditLog.$inferSelect)['targetName'];
};

export type GuildDatabaseAdapter<FormSchema extends ZodSchema, DbSchema extends ZodSchema> = {
  dbSchema: DbSchema;
  formSchema: FormSchema;
  metadata: AuditLogMetadata;
  fetchOldValue: (guildId: string) => Promise<z.infer<DbSchema> | null>;
  upsertNewValue: (guildId: string, data: z.infer<FormSchema>) => Promise<z.infer<DbSchema>>;
};

export type CreateGuildDatabaseAdapterOptions<
  FormSchema extends ZodSchema,
  DbSchema extends ZodSchema,
> = {
  table: PgTable;
  guildIdColumn: PgColumn;
  metadata: AuditLogMetadata;
  dbSchema: DbSchema;
  formSchema: FormSchema;
};

/**
 * {@link GuildDatabaseAdapter} を作成する関数
 * @param options {@link CreateGuildDatabaseAdapterOptions}
 */
export function createGuildDatabaseAdapter<
  FormSchema extends ZodSchema,
  DbSchema extends ZodSchema,
>(
  options: CreateGuildDatabaseAdapterOptions<FormSchema, DbSchema>,
): GuildDatabaseAdapter<FormSchema, DbSchema> {
  return {
    dbSchema: options.dbSchema,
    formSchema: options.formSchema,
    metadata: options.metadata,
    fetchOldValue: async (guildId) => {
      const res = await db.select().from(options.table).where(eq(options.guildIdColumn, guildId));
      return res[0] ?? null;
    },
    upsertNewValue: async (guildId, data) => {
      const res = await db
        .insert(options.table)
        .values({ guildId, ...data })
        .onConflictDoUpdate({ target: options.guildIdColumn, set: data })
        .returning();
      return res[0];
    },
  };
}

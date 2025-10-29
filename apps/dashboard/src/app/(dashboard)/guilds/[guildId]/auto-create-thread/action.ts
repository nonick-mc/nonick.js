'use server';

import { auditLog, autoCreateThreadRule } from '@repo/database';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import type { ZodString } from 'zod';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/clients';
import { snowflakeSchema } from '@/lib/zod/discord';
import { RulesMaxSize } from './constants';
import { createRuleFormSchema, updateRuleFormSchema } from './schema';

export const createRuleAction = guildActionClient
  .inputSchema(createRuleFormSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId], ctx: { session } }) => {
    const currentRules = await db.query.autoCreateThreadRule.findMany({
      where: (rule, { eq }) => eq(rule.guildId, guildId),
    });

    if (currentRules.length >= RulesMaxSize) {
      throw new Error('The maximum number of rules has been exceeded.');
    }

    const [newRule] = await db
      .insert(autoCreateThreadRule)
      .values({ guildId, ...parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId,
      authorId: session.user.id,
      targetName: 'auto_create_thread',
      actionType: 'create_rule',
      after: newRule,
    });

    revalidatePath(`/guilds/${guildId}/auto-create-thread`);
  });

export const updateRuleAction = guildActionClient
  .bindArgsSchemas<[guildId: ZodString, channelId: ZodString]>([snowflakeSchema, snowflakeSchema])
  .inputSchema(updateRuleFormSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId, channelId], ctx: { session } }) => {
    const beforeRule = await db.query.autoCreateThreadRule.findFirst({
      where: (rule, { eq, and }) => and(eq(rule.guildId, guildId), eq(rule.channelId, channelId)),
    });

    const [afterRule] = await db
      .update(autoCreateThreadRule)
      .set(parsedInput)
      .where(
        and(
          eq(autoCreateThreadRule.guildId, guildId),
          eq(autoCreateThreadRule.channelId, channelId),
        ),
      )
      .returning();

    await db.insert(auditLog).values({
      guildId,
      authorId: session.user.id,
      targetName: 'auto_create_thread',
      actionType: 'update_rule',
      before: beforeRule,
      after: afterRule,
    });

    revalidatePath(`/guilds/${guildId}/auto-create-thread`);
  });

export const deleteRuleAction = guildActionClient
  .bindArgsSchemas<[guildId: ZodString, channelId: ZodString]>([snowflakeSchema, snowflakeSchema])
  .action(async ({ bindArgsParsedInputs: [guildId, channelId], ctx: { session } }) => {
    const beforeRule = await db.query.autoCreateThreadRule.findFirst({
      where: (rule, { eq, and }) => and(eq(rule.guildId, guildId), eq(rule.channelId, channelId)),
    });

    await db
      .delete(autoCreateThreadRule)
      .where(
        and(
          eq(autoCreateThreadRule.guildId, guildId),
          eq(autoCreateThreadRule.channelId, channelId),
        ),
      );

    await db.insert(auditLog).values({
      guildId,
      authorId: session.user.id,
      targetName: 'auto_create_thread',
      actionType: 'delete_rule',
      before: beforeRule,
    });

    revalidatePath(`/guilds/${guildId}/auto-create-thread`);
  });

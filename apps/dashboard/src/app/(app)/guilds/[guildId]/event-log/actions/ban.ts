﻿'use server';

import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';
import { auditLog } from '@repo/database';
import { banLogSetting } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { settingFormSchema } from '../schemas/ban';

export const updateSettingAction = guildActionClient
  .inputSchema(settingFormSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    if (!ctx.session) throw new Error('Unauthorized');
    const guildId = bindArgsParsedInputs[0];

    const oldValue = await db.query.banLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newValue] = await db
      .insert(banLogSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: banLogSetting.guildId, set: parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId: guildId,
      authorId: ctx.session.user.id,
      targetName: 'ban_log',
      actionType: 'update_guild_setting',
      oldValue,
      newValue,
    });

    revalidatePath('/');
  });

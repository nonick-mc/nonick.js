﻿'use server';

import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';
import { auditLog } from '@repo/database';
import { autoChangeVerifyLevelSetting } from '@repo/database';
import { settingFormSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(settingFormSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    if (!ctx.session) throw new Error('Unauthorized');
    const guildId = bindArgsParsedInputs[0];

    const oldValue = await db.query.autoChangeVerifyLevelSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newValue] = await db
      .insert(autoChangeVerifyLevelSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: autoChangeVerifyLevelSetting.guildId, set: parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId: guildId,
      authorId: ctx.session.user.id,
      targetName: 'auto_change_verify_level',
      actionType: 'update_guild_setting',
      oldValue,
      newValue,
    });
  });

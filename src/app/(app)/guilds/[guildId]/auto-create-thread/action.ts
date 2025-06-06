'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { autoCreateThreadSetting } from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';
import { settingFormSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(settingFormSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    if (!ctx.session) throw new Error('Unauthorized');
    const guildId = bindArgsParsedInputs[0];

    const oldValue = await db.query.autoCreateThreadSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newValue] = await db
      .insert(autoCreateThreadSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: autoCreateThreadSetting.guildId, set: parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId: guildId,
      authorId: ctx.session.user.id,
      targetName: 'auto_create_thread',
      actionType: 'update_guild_setting',
      oldValue,
      newValue,
    });
  });

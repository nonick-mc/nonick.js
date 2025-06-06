'use server';

import { auditLog } from '@/lib/database/src/schema/audit-log';
import { autoPublicSetting } from '@/lib/database/src/schema/setting';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/client';
import { settingFormSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(settingFormSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    if (!ctx.session) throw new Error('Unauthorized');
    const guildId = bindArgsParsedInputs[0];

    const oldValue = await db.query.autoPublicSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newValue] = await db
      .insert(autoPublicSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: autoPublicSetting.guildId, set: parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId: guildId,
      authorId: ctx.session.user.id,
      targetName: 'auto_public',
      actionType: 'update_guild_setting',
      oldValue,
      newValue,
    });
  });

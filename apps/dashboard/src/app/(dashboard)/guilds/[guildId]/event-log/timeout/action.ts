'use server';

import { auditLog, timeoutLogSetting } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/clients';
import { formSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId], ctx: { session } }) => {
    const currentSetting = await db.query.timeoutLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newSetting] = await db
      .insert(timeoutLogSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: timeoutLogSetting.guildId, set: parsedInput })
      .returning();

    db.insert(auditLog).values({
      guildId,
      authorId: session.user.discordUserId,
      targetName: 'timeout_log',
      actionType: 'update_guild_setting',
      oldValue: currentSetting,
      newValue: newSetting,
    });

    revalidatePath('/');
  });

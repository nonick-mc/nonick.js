'use server';

import { auditLog, banLogSetting } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/clients';
import { formSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId], ctx: { session } }) => {
    const currentSetting = await db.query.banLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newSetting] = await db
      .insert(banLogSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: banLogSetting.guildId, set: parsedInput })
      .returning();

    db.insert(auditLog).values({
      guildId,
      authorId: session.user.discordUserId,
      targetName: 'ban_log',
      actionType: 'update_guild_setting',
      oldValue: currentSetting,
      newValue: newSetting,
    });

    revalidatePath('/');
  });

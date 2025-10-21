'use server';

import { auditLog, msgEditLogSetting } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/clients';
import { formSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId], ctx: { session } }) => {
    const currentSetting = await db.query.msgEditLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newSetting] = await db
      .insert(msgEditLogSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: msgEditLogSetting.guildId, set: parsedInput })
      .returning();

    db.insert(auditLog).values({
      guildId,
      authorId: session.user.discordUserId,
      targetName: 'message_edit_log',
      actionType: 'update_guild_setting',
      oldValue: currentSetting,
      newValue: newSetting,
    });

    revalidatePath('/');
  });

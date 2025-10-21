'use server';

import { auditLog, msgExpandSetting } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/clients';
import { formSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId], ctx: { session } }) => {
    const currentSetting = await db.query.msgExpandSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newSetting] = await db
      .insert(msgExpandSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: msgExpandSetting.guildId, set: parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId,
      authorId: session.user.discordUserId,
      targetName: 'message_expand',
      actionType: 'update_guild_setting',
      oldValue: currentSetting,
      newValue: newSetting,
    });

    revalidatePath('/');
  });

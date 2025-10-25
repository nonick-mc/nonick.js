'use server';

import { auditLog, leaveMessageSetting } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/clients';
import { formSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId], ctx: { session } }) => {
    const currentSetting = await db.query.leaveMessageSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [newSetting] = await db
      .insert(leaveMessageSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: leaveMessageSetting.guildId, set: parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId,
      authorId: session.user.discordUserId,
      targetName: 'leave_message',
      actionType: 'update_guild_setting',
      oldValue: currentSetting,
      newValue: newSetting,
    });

    revalidatePath('/');
  });

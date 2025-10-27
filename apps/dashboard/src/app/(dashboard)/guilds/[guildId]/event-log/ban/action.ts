'use server';

import { auditLog, banLogSetting } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/clients';
import { formSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId], ctx: { session } }) => {
    const beforeSetting = await db.query.banLogSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [afterSetting] = await db
      .insert(banLogSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: banLogSetting.guildId, set: parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId,
      authorId: session.user.id,
      targetName: 'ban_log',
      actionType: 'update_guild_setting',
      before: beforeSetting,
      after: afterSetting,
    });

    revalidatePath('/');
  });

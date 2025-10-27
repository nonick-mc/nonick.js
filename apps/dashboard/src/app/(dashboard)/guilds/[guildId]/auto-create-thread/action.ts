'use server';

import { auditLog, autoCreateThreadSetting } from '@repo/database';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/drizzle';
import { guildActionClient } from '@/lib/safe-action/clients';
import { formSchema } from './schema';

export const updateSettingAction = guildActionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput, bindArgsParsedInputs: [guildId], ctx: { session } }) => {
    const beforeSetting = await db.query.autoCreateThreadSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    const [afterSetting] = await db
      .insert(autoCreateThreadSetting)
      .values({ guildId, ...parsedInput })
      .onConflictDoUpdate({ target: autoCreateThreadSetting.guildId, set: parsedInput })
      .returning();

    await db.insert(auditLog).values({
      guildId,
      authorId: session.user.id,
      targetName: 'auto_create_thread',
      actionType: 'update_guild_setting',
      before: beforeSetting,
      after: afterSetting,
    });

    revalidatePath('/');
  });

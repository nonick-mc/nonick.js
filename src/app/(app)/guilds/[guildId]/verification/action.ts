'use server';

import { createInsertSchema } from '@/lib/database/src/lib/drizzle';
import { verificationSetting } from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';
import { revalidatePath } from 'next/cache';
import { verificationSettingFormSchema } from './schema';

export const updateVerificationSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(verificationSettingFormSchema))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'verification' },
        table: verificationSetting,
        guildIdColumn: verificationSetting.guildId,
        dbSchema: createInsertSchema(verificationSetting),
        formSchema: verificationSettingFormSchema,
      }),
    );
    await revalidatePath('/');
    return { success: true };
  });

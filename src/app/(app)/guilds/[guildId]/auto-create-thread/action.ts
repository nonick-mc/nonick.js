'use server';

import {
  autoCreateThreadSetting,
  autoCreateThreadSettingSchema,
} from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateAutoCreateThreadSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(autoCreateThreadSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'auto_create_thread' },
        table: autoCreateThreadSetting,
        guildIdColumn: autoCreateThreadSetting.guildId,
        dbSchema: autoCreateThreadSettingSchema.db,
        formSchema: autoCreateThreadSettingSchema.form,
      }),
    );
    return { success: true };
  });

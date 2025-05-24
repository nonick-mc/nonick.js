'use server';

import {
  autoChangeVerifyLevelSetting,
  autoChangeVerifyLevelSettingSchema,
} from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateAutoChangeVerifyLevelSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(autoChangeVerifyLevelSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'auto_change_verify_level' },
        table: autoChangeVerifyLevelSetting,
        guildIdColumn: autoChangeVerifyLevelSetting.guildId,
        dbSchema: autoChangeVerifyLevelSettingSchema.db,
        formSchema: autoChangeVerifyLevelSettingSchema.form,
      }),
    );
    return { success: true };
  });

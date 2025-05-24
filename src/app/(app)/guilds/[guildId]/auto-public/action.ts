'use server';

import { autoPublicSetting, autoPublicSettingSchema } from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateAutoPublicSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(autoPublicSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'auto_public' },
        table: autoPublicSetting,
        guildIdColumn: autoPublicSetting.guildId,
        dbSchema: autoPublicSettingSchema.db,
        formSchema: autoPublicSettingSchema.form,
      }),
    );
    return { success: true };
  });

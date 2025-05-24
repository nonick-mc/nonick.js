'use server';

import { autoModSetting, autoModSettingSchema } from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateAutoModSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(autoModSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'auto_mod' },
        table: autoModSetting,
        guildIdColumn: autoModSetting.guildId,
        dbSchema: autoModSettingSchema.db,
        formSchema: autoModSettingSchema.form,
      }),
    );
    return { success: true };
  });

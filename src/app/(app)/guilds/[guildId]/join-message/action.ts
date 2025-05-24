'use server';

import { joinMessageSetting, joinMessageSettingSchema } from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateJoinMessageSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(joinMessageSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'join_message' },
        table: joinMessageSetting,
        guildIdColumn: joinMessageSetting.guildId,
        dbSchema: joinMessageSettingSchema.db,
        formSchema: joinMessageSettingSchema.form,
      }),
    );
    return { success: true };
  });

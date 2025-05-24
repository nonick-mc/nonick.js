'use server';

import { leaveMessageSetting, leaveMessageSettingSchema } from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';

export const updateLeaveMessageSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(leaveMessageSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'leave_message' },
        table: leaveMessageSetting,
        guildIdColumn: leaveMessageSetting.guildId,
        dbSchema: leaveMessageSettingSchema.db,
        formSchema: leaveMessageSettingSchema.form,
      }),
    );
    return { success: true };
  });

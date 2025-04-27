'use server';

import {
  banLogSetting,
  banLogSettingSchema,
  kickLogSetting,
  kickLogSettingSchema,
  msgDeleteLogSetting,
  msgDeleteLogSettingSchema,
  msgEditLogSetting,
  msgEditLogSettingSchema,
  timeoutLogSetting,
  timeoutLogSettingSchema,
  voiceLogSetting,
  voiceLogSettingSchema,
} from '@/lib/database/src/schema/setting';
import { updateGuildSetting } from '@/lib/safe-action/action/update-guild-setting';
import { createGuildDatabaseAdapter } from '@/lib/safe-action/action/utils';
import { guildActionClient } from '@/lib/safe-action/client';
import { revalidatePath } from 'next/cache';

export const updateTimeoutLogSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(timeoutLogSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'timeout_log' },
        table: timeoutLogSetting,
        guildIdColumn: timeoutLogSetting.guildId,
        dbSchema: timeoutLogSettingSchema.db,
        formSchema: timeoutLogSettingSchema.form,
      }),
    );
    revalidatePath('/');
    return { success: true };
  });

export const updateKickLogSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(kickLogSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'kick_log' },
        table: kickLogSetting,
        guildIdColumn: kickLogSetting.guildId,
        dbSchema: kickLogSettingSchema.db,
        formSchema: kickLogSettingSchema.form,
      }),
    );
    revalidatePath('/');
    return { success: true };
  });

export const updateBanLogSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(banLogSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'ban_log' },
        table: banLogSetting,
        guildIdColumn: banLogSetting.guildId,
        dbSchema: banLogSettingSchema.db,
        formSchema: banLogSettingSchema.form,
      }),
    );
    revalidatePath('/');
    return { success: true };
  });

export const updateVoiceLogSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(voiceLogSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'voice_log' },
        table: voiceLogSetting,
        guildIdColumn: voiceLogSetting.guildId,
        dbSchema: voiceLogSettingSchema.db,
        formSchema: voiceLogSettingSchema.form,
      }),
    );
    revalidatePath('/');
    return { success: true };
  });

export const updateMsgEditLogSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(msgEditLogSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'message_edit_log' },
        table: msgEditLogSetting,
        guildIdColumn: msgEditLogSetting.guildId,
        dbSchema: msgEditLogSettingSchema.db,
        formSchema: msgEditLogSettingSchema.form,
      }),
    );
    revalidatePath('/');
    return { success: true };
  });

export const updateMsgDeleteLogSettingAction = guildActionClient
  .schema(async (prevSchema) => prevSchema.and(msgDeleteLogSettingSchema.form))
  .action(async ({ parsedInput: { guildId, ...input }, ctx }) => {
    await updateGuildSetting(
      guildId,
      input,
      ctx,
      createGuildDatabaseAdapter({
        metadata: { targetName: 'message_delete_log' },
        table: msgDeleteLogSetting,
        guildIdColumn: msgDeleteLogSetting.guildId,
        dbSchema: msgDeleteLogSettingSchema.db,
        formSchema: msgDeleteLogSettingSchema.form,
      }),
    );
    revalidatePath('/');
    return { success: true };
  });

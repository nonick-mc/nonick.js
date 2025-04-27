import { ChannelType, GuildVerificationLevel } from 'discord-api-types/v10';
import { boolean, integer, jsonb, pgSchema, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from '../lib/drizzle';
import { z } from '../lib/i18n';
import { timestamps } from '../utils/drizzle';
import { domainRegex, isUniqueArray } from '../utils/zod';
import { messageOptions, snowflake, snowflakeRegex } from '../utils/zod/discord';
import { guild } from './guild';

export const settingSchema = pgSchema('public_setting');

const guildId = text('guild_id')
  .primaryKey()
  .references(() => guild.id, { onDelete: 'cascade' });

const baseLogSetting = {
  guildId,
  enabled: boolean('enabled').notNull(),
  channel: text('channel'),
  ...timestamps,
};

// #region JoinMessage
export const joinMessageSetting = settingSchema.table('join_message', {
  guildId,
  enabled: boolean('enabled').notNull(),
  channel: text('channel'),
  ignoreBot: boolean('ignore_bot').notNull(),
  message: jsonb('message').$type<z.infer<typeof messageOptions>>().notNull(),
  ...timestamps,
});

export const joinMessageSettingSchema = {
  db: createInsertSchema(joinMessageSetting),
  form: createInsertSchema(joinMessageSetting, {
    channel: (schema) => schema.regex(snowflakeRegex),
    message: messageOptions,
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && !v.channel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['channel'],
        });
      }
    }),
};
// #endregion

// #region LeaveMessage
export const leaveMessageSetting = settingSchema.table('leave_message', {
  guildId,
  enabled: boolean('enabled').notNull(),
  channel: text('channel'),
  ignoreBot: boolean('ignore_bot').notNull(),
  message: jsonb('message').$type<z.infer<typeof messageOptions>>().notNull(),
  ...timestamps,
});

export const leaveMessageSettingSchema = {
  db: createInsertSchema(leaveMessageSetting),
  form: createInsertSchema(leaveMessageSetting, {
    channel: (schema) => schema.regex(snowflakeRegex),
    message: messageOptions,
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && !v.channel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['channel'],
        });
      }
    }),
};
// #endregion

// #region Report
export const reportSetting = settingSchema.table('report', {
  guildId,
  channel: text('channel'),
  includeModerator: boolean('include_moderator').notNull(),
  showProgressButton: boolean('show_progress_button').notNull(),
  enableMention: boolean('enable_mention').notNull(),
  mentionRoles: text('mention_roles').array().notNull(),
  ...timestamps,
});

export const reportSettingSchema = {
  db: createInsertSchema(reportSetting),
  form: createInsertSchema(reportSetting, {
    channel: z.string().regex(snowflakeRegex),
    mentionRoles: z
      .array(z.string().regex(snowflakeRegex))
      .max(100)
      .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enableMention && !v.mentionRoles.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_role' },
          path: ['mentionRoles'],
        });
      }
    }),
};

// #endregion

// #region EventLog (Timeout)
export const timeoutLogSetting = settingSchema.table('timeout_log', baseLogSetting);

export const timeoutLogSettingSchema = {
  db: createInsertSchema(timeoutLogSetting),
  form: createInsertSchema(timeoutLogSetting, {
    channel: (schema) => schema.regex(snowflakeRegex),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && !v.channel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['channel'],
        });
      }
    }),
};
// #endregion

// #region EventLog (Kick)
export const kickLogSetting = settingSchema.table('kick_log', baseLogSetting);

export const kickLogSettingSchema = {
  db: createInsertSchema(kickLogSetting),
  form: createInsertSchema(kickLogSetting, {
    channel: (schema) => schema.regex(snowflakeRegex),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && !v.channel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['channel'],
        });
      }
    }),
};
// #endregion

// #region EventLog (Ban)
export const banLogSetting = settingSchema.table('ban_log', baseLogSetting);

export const banLogSettingSchema = {
  db: createInsertSchema(banLogSetting),
  form: createInsertSchema(banLogSetting, {
    channel: (schema) => schema.regex(snowflakeRegex),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && !v.channel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['channel'],
        });
      }
    }),
};
// #endregion

// #region EventLog (VC)
export const voiceLogSetting = settingSchema.table('voice_log', baseLogSetting);

export const voiceLogSettingSchema = {
  db: createInsertSchema(voiceLogSetting),
  form: createInsertSchema(voiceLogSetting, {
    channel: (schema) => schema.regex(snowflakeRegex),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && !v.channel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['channel'],
        });
      }
    }),
};
// #endregion

// #region EventLog (MessageDelete)
export const msgDeleteLogSetting = settingSchema.table('message_delete_log', baseLogSetting);

export const msgDeleteLogSettingSchema = {
  db: createInsertSchema(msgDeleteLogSetting),
  form: createInsertSchema(msgDeleteLogSetting, {
    channel: (schema) => schema.regex(snowflakeRegex),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && !v.channel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['channel'],
        });
      }
    }),
};
// #endregion

// #region EventLog (MessageEdit)
export const msgEditLogSetting = settingSchema.table('message_edit_log', baseLogSetting);

export const msgEditLogSettingSchema = {
  db: createInsertSchema(msgEditLogSetting),
  form: createInsertSchema(msgEditLogSetting, {
    channel: (schema) => schema.regex(snowflakeRegex),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && !v.channel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['channel'],
        });
      }
    }),
};
// #endregion

// #region MessageExpand
export const msgExpandSetting = settingSchema.table('message_expand', {
  guildId,
  enabled: boolean('enabled').notNull(),
  allowExternalGuild: boolean('allow_external_guild').notNull(),
  ignoreChannels: text('ignore_channels').array().notNull(),
  ignoreChannelTypes: text('ignore_channel_types').array().notNull(),
  ignorePrefixes: text('ignore_prefixes').array().notNull(),
  ...timestamps,
});

export const ignorePrefixes = ['!', '?', '.', '#', '$', '%', '&', '^', '<'];

export const msgExpandSettingSchema = {
  db: createInsertSchema(msgExpandSetting),
  form: createInsertSchema(msgExpandSetting, {
    ignoreChannels: z
      .array(z.string().regex(snowflakeRegex))
      .max(100)
      .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
    ignoreChannelTypes: z
      .array(z.preprocess((v) => Number(v), z.nativeEnum(ChannelType)))
      .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
    ignorePrefixes: z
      .array(z.string())
      .max(5)
      .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } })
      .refine((v) => v.every((prefix) => ignorePrefixes.includes(prefix)), {
        params: { i18n: 'invalid_prefixes' },
      }),
  }).omit({ guildId: true, createdAt: true, updatedAt: true }),
};
// #endregion

// #region AutoChangeVerifyLevel
export const autoChangeVerifyLevelSetting = settingSchema.table('auto_change_verify_level', {
  guildId,
  enabled: boolean('enabled').notNull(),
  startHour: integer('start_hour').notNull(),
  endHour: integer('end_hour').notNull(),
  level: integer('level').notNull(),
  enableLog: boolean('enable_log').notNull(),
  logChannel: text('log_channel'),
  ...timestamps,
});

export const autoChangeVerifyLevelSettingSchema = {
  db: createInsertSchema(autoChangeVerifyLevelSetting),
  form: createInsertSchema(autoChangeVerifyLevelSetting, {
    level: z.preprocess((v) => Number(v), z.nativeEnum(GuildVerificationLevel)),
    startHour: z.preprocess((v) => Number(v), z.number().int().min(0).max(23)),
    endHour: z.preprocess((v) => Number(v), z.number().int().min(0).max(23)),
    logChannel: (schema) => schema.regex(snowflakeRegex),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.startHour === v.endHour) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'same_start_end_time' },
          path: ['endHour'],
        });
      }

      if (v.enabled && v.enableLog && !v.logChannel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['logChannel'],
        });
      }
    }),
};
// #endregion

// #region AutoPublic
export const autoPublicSetting = settingSchema.table('auto_public', {
  guildId,
  enabled: boolean('enabled').notNull(),
  channels: text('channels').array().notNull(),
  ...timestamps,
});

export const autoPublicSettingSchema = {
  db: createInsertSchema(autoPublicSetting),
  form: createInsertSchema(autoPublicSetting, {
    channels: z
      .array(z.string().regex(snowflakeRegex))
      .max(100)
      .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
  }).omit({ guildId: true, createdAt: true, updatedAt: true }),
};
// #endregion

// #region AutoCreateThread
export const autoCreateThreadSetting = settingSchema.table('auto_create_thread', {
  guildId,
  enabled: boolean('enabled').notNull(),
  channels: text('channels').array().notNull(),
  ...timestamps,
});

export const autoCreateThreadSettingSchema = {
  db: createInsertSchema(autoCreateThreadSetting),
  form: createInsertSchema(autoCreateThreadSetting, {
    channels: z
      .array(z.string().regex(snowflakeRegex))
      .max(100)
      .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
  }).omit({ guildId: true, createdAt: true, updatedAt: true }),
};
// #endregion

// #region AutoMod Plus
export const autoModSetting = settingSchema.table('auto_mod', {
  guildId,
  enabled: boolean('enabled').notNull(),
  enableDomainFilter: boolean('enable_domain_filter').notNull(),
  enableInviteUrlFilter: boolean('enable_invite_url_filter').notNull(),
  enableTokenFilter: boolean('enable_token_filter').notNull(),
  domainList: text('domain_list').array().notNull(),
  ignoreChannels: text('ignore_channels').array().notNull(),
  ignoreRoles: text('ignore_roles').array().notNull(),
  enableLog: boolean('enable_log').notNull(),
  logChannel: text('log_channel'),
  ...timestamps,
});

export const autoModSettingSchema = {
  db: createInsertSchema(autoModSetting),
  form: createInsertSchema(autoModSetting, {
    domainList: z.preprocess(
      (v) =>
        String(v)
          .split(/,|\n/)
          .reduce<string[]>((acc, item) => {
            const trimmed = item.trim();
            if (trimmed) acc.push(trimmed);
            return acc;
          }, []),
      z
        .array(z.string())
        .max(20)
        .refine((v) => v.every((domain) => domainRegex.test(domain)), {
          params: { i18n: 'invalid_domains' },
        })
        .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
    ),
    ignoreChannels: z
      .array(z.string().regex(snowflakeRegex))
      .max(100)
      .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
    ignoreRoles: z
      .array(z.string().regex(snowflakeRegex))
      .max(100)
      .refine(isUniqueArray, { params: { i18n: 'duplicate_item' } }),
    logChannel: (schema) => schema.regex(snowflakeRegex),
  })
    .omit({ guildId: true, createdAt: true, updatedAt: true })
    .superRefine((v, ctx) => {
      if (v.enabled && v.enableLog && !v.logChannel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { i18n: 'missing_channel' },
          path: ['logChannel'],
        });
      }
    }),
};
// #endregion

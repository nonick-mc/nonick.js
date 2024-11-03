import { GuildVerificationLevel } from 'discord-api-types/v10';
import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { AutoChangeVerifyLevelConfig } from '../zod';
import { BaseConfigSchema } from '../zod/util';
import { guildId } from './util';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(AutoChangeVerifyLevelConfig);

const autoChangeVerifyLevelSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  enabled: { type: Schema.Types.Boolean },
  startHour: { type: Schema.Types.Number },
  endHour: { type: Schema.Types.Number },
  level: { type: Schema.Types.Number, enum: GuildVerificationLevel },
  log: {
    enabled: Schema.Types.Boolean,
    channel: Schema.Types.String,
  },
});

export default models?.autoChangeVerifyLevelConfig
  ? (models.autoChangeVerifyLevelConfig as Model<z.infer<typeof zodSchema>>)
  : model('autoChangeVerifyLevelConfig', autoChangeVerifyLevelSchema);

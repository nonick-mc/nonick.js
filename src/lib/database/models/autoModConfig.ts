import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { AutoModConfig } from '../zod';
import { BaseConfigSchema } from '../zod/util';
import { guildId } from './util';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(AutoModConfig);

const autoModSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  enabled: Schema.Types.Boolean,
  filter: {
    domain: {
      enabled: Schema.Types.Boolean,
      list: [Schema.Types.String],
    },
    inviteUrl: Schema.Types.Boolean,
    token: Schema.Types.Boolean,
  },
  ignore: {
    channels: [Schema.Types.String],
    roles: [Schema.Types.String],
  },
  log: {
    enabled: Schema.Types.Boolean,
    channel: Schema.Types.String,
  },
});

export default models?.autoModConfig
  ? (models.autoModConfig as Model<z.infer<typeof zodSchema>>)
  : model('autoModConfig', autoModSchema);

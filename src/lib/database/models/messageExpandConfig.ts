import { ChannelType } from 'discord-api-types/v10';
import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { MessageExpandConfig } from '../zod';
import { BaseConfigSchema } from '../zod/util';
import { guildId } from './util';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(MessageExpandConfig);

const messageExpandSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  allowExternalGuild: Schema.Types.Boolean,
  enabled: Schema.Types.Boolean,
  ignore: {
    channels: [Schema.Types.String],
    types: [{ type: Schema.Types.Number, enum: ChannelType }],
    prefixes: [{ type: Schema.Types.String, length: 1 }],
  },
});

export default models?.messageExpandConfig
  ? (models.messageExpandConfig as Model<z.infer<typeof zodSchema>>)
  : model('messageExpandConfig', messageExpandSchema);

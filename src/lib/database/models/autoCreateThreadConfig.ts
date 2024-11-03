import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { AutoCreateThreadConfig } from '../zod';
import { BaseConfigSchema } from '../zod/util';
import { guildId } from './util';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(AutoCreateThreadConfig);

const autoCreateThreadSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  channels: [Schema.Types.String],
  enabled: Schema.Types.Boolean,
});

export default models?.autoCreateThreadConfig
  ? (models.autoCreateThreadConfig as Model<z.infer<typeof zodSchema>>)
  : model('autoCreateThreadConfig', autoCreateThreadSchema);

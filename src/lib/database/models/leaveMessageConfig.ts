import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { LeaveMessageConfig } from '../zod';
import { BaseConfigSchema } from '../zod/util';
import { guildId, messageOptionSchema } from './util';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(LeaveMessageConfig);

const leaveMessageSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  channel: Schema.Types.String,
  enabled: Schema.Types.Boolean,
  ignoreBot: Schema.Types.Boolean,
  message: messageOptionSchema,
});

export default models?.leaveMessageConfig
  ? (models.leaveMessageConfig as Model<z.infer<typeof zodSchema>>)
  : model('leaveMessageConfig', leaveMessageSchema);

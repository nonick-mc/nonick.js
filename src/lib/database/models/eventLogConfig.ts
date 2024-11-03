import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import { EventLogConfig } from '../zod';
import type { LogConfig } from '../zod/eventLogConfig';
import { BaseConfigSchema } from '../zod/util';
import { guildId } from './util';

const { Schema, model, models } = mongoose;
const zodSchema = BaseConfigSchema.and(EventLogConfig);

const LogSchema = new Schema<z.infer<typeof LogConfig>>({
  channel: Schema.Types.String,
  enabled: Schema.Types.Boolean,
});

const eventLogSchema = new Schema<z.infer<typeof zodSchema>>({
  guildId,
  ban: LogSchema,
  kick: LogSchema,
  messageDelete: LogSchema,
  messageEdit: LogSchema,
  timeout: LogSchema,
  voice: LogSchema,
});

export default models?.eventLogConfig
  ? (models.eventLogConfig as Model<z.infer<typeof zodSchema>>)
  : model('eventLogConfig', eventLogSchema);

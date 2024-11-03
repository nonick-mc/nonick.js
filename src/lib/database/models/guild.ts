import { GuildVerificationLevel } from 'discord-api-types/v10';
import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import type { Guild } from '../zod';
import { guildId } from './util';

const { Schema, model, models } = mongoose;

const guildSchema = new Schema<z.infer<typeof Guild>>({
  guildId,
  beforeVerifyLevel: {
    type: Schema.Types.Number,
    enum: GuildVerificationLevel,
  },
  createAt: { type: Schema.Types.Date, default: Date.now },
});

export default models?.guild
  ? (models.guild as Model<z.infer<typeof Guild>>)
  : model('guild', guildSchema);

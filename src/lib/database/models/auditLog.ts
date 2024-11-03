import mongoose, { type Model } from 'mongoose';
import type { z } from 'zod';
import type { AuditLog } from '../zod';

const { Schema, model, models } = mongoose;

const AuditLogSchema = new Schema<z.infer<typeof AuditLog>>({
  guildId: {
    required: true,
    type: Schema.Types.String,
  },
  after: Schema.Types.Mixed,
  authorId: Schema.Types.String,
  before: Schema.Types.Mixed,
  reason: Schema.Types.String,
  createAt: { type: Schema.Types.Date, default: Date.now },
});

export default models?.auditLog
  ? (models.auditLog as Model<typeof AuditLog>)
  : model('auditLog', AuditLogSchema);

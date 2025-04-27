import { createSchemaFactory } from 'drizzle-zod';
import { z } from './i18n';

export const { createInsertSchema } = createSchemaFactory({
  zodInstance: z,
  coerce: { number: true },
});

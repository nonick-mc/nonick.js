'use server';

import { ReportConfig as model } from '@/lib/database/models';
import { ReportConfig as schema } from '@/lib/database/zod';
import { dashboardActionClient } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';

export const updateConfig = dashboardActionClient
  .schema(async (prevSchema) => prevSchema.and(schema))
  .metadata({ actionName: 'updateConfig' })
  .action(async ({ parsedInput }) => {
    await model.updateOne(
      { guildId: parsedInput.guildId },
      { $set: parsedInput },
      { upsert: true },
    );

    revalidatePath('/');
    return { success: true };
  });

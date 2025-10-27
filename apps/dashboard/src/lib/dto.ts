import { cache } from 'react';
import { db } from './drizzle';

export const getVerificationSetting = cache(async (guildId: string) => {
  return db.query.verificationSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, guildId),
  });
});

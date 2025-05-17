'use server';

import { addGuildMemberRole, getGuild, isUserJoinedGuild } from '@/lib/discord/api';
import { db } from '@/lib/drizzle';
import { userActionClient } from '@/lib/safe-action/client';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { captchaFormSchema } from './schema';

export const verifyAction = userActionClient
  .schema(async (prevSchema) => prevSchema.and(captchaFormSchema))
  .action(async ({ parsedInput: { guildId, turnstileToken }, ctx }) => {
    try {
      const guild = await getGuild(guildId);
      const setting = await db.query.verificationSetting.findFirst({
        where: (setting, { eq }) => eq(setting.guildId, guild.id),
      });

      if (!setting?.enabled || !setting.role || setting.captchaType !== 'web')
        throw new Error('Unavailable Verification');
      if (!(await isUserJoinedGuild(guild.id))) throw new Error('User Not Joined Guild');

      await verifyTurnstileToken(turnstileToken);
      await addGuildMemberRole(guild.id, setting.role, ctx.session?.user.id as string);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e);
        return {
          error: e.message,
        };
      }
    }
  });

'use server';

import { addGuildMemberRole, getGuild, isUserJoinedGuild } from '@/lib/discord/api';
import { db } from '@/lib/drizzle';
import { userActionClient } from '@/lib/safe-action/client';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { captchaFormSchema } from './schema';

export const verifyAction = userActionClient
  .inputSchema(captchaFormSchema)
  .action(async ({ parsedInput: { turnstileToken }, bindArgsParsedInputs, ctx }) => {
    const guild = await getGuild(bindArgsParsedInputs[0]);
    const setting = await db.query.verificationSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guild.id),
    });

    if (!setting?.enabled || !setting.role || setting.captchaType !== 'web')
      throw new Error('Unavailable Verification');
    if (!(await isUserJoinedGuild(guild.id))) throw new Error('User Not Joined Guild');

    await verifyTurnstileToken(turnstileToken);
    addGuildMemberRole(guild.id, setting.role, ctx.session?.user.id as string);
  });

'use server';

import { canAccessVerifyPage, isAvailableVerifyPage } from '@/lib/dal';
import { addGuildMemberRole } from '@/lib/discord/api';
import { db } from '@/lib/drizzle';
import { userActionClient } from '@/lib/safe-action/clients';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { formSchema } from './schema';

export const verifyAction = userActionClient
  .inputSchema(formSchema)
  .action(async ({ parsedInput: { turnstileToken }, bindArgsParsedInputs, ctx }) => {
    const [guildId] = bindArgsParsedInputs;

    const isAvailable = await isAvailableVerifyPage(bindArgsParsedInputs[0]);
    if (!isAvailable) throw new Error('Unavailable Verification');
    const canAccess = await canAccessVerifyPage(bindArgsParsedInputs[0]);
    if (!canAccess) throw new Error('Forbidden Access');

    await verifyTurnstileToken(turnstileToken);

    const setting = await db.query.verificationSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, guildId),
    });

    await addGuildMemberRole(guildId, setting?.role as string, ctx.session.user.discordUserId);
  });

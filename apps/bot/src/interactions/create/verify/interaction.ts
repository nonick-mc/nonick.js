import { Button } from '@akki256/discord-interaction';
import { GuildMemberFlags, inlineCode, MessageFlags } from 'discord.js';
import { db } from '@/modules/drizzle';
import { verifyForButtonCaptcha, verifyForImageCaptcha, verifyForWebCaptcha } from './_function';

const verifyButton = new Button(
  {
    customId: 'nonick-js:verify',
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const setting = await db.query.verificationSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });

    if (!setting?.enabled) {
      return interaction.reply({
        content: '`❌` 現在この機能を利用できません。サーバーの管理者に連絡してください。',
        flags: MessageFlags.Ephemeral,
      });
    }

    const hasRole = interaction.member.roles.cache.has(setting.role as string);
    const hasBypassFlag = interaction.member.flags.has(GuildMemberFlags.BypassesVerification);

    if (
      (setting.mode === 'role' && hasRole) ||
      (setting.mode === 'bypass_verification' && hasBypassFlag)
    ) {
      return interaction.reply({
        content: `${inlineCode('✅')} 既に認証されています。`,
        flags: MessageFlags.Ephemeral,
      });
    }

    switch (setting.captchaType) {
      case 'button':
        return verifyForButtonCaptcha(interaction, setting);
      case 'image':
        return verifyForImageCaptcha(interaction, setting);
      case 'web':
        return verifyForWebCaptcha(interaction);
    }
  },
);

export default [verifyButton];

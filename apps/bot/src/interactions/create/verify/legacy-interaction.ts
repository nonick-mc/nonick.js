import { Button } from '@akki256/discord-interaction';
import { GuildMemberRoleManager, inlineCode } from 'discord.js';
import { verifyForButtonCaptcha, verifyForImageCaptcha } from './_function';

const verifyButton = new Button(
  {
    customId: /^nonick-js:verify-(button|image)$/,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const roleId =
      interaction.message.embeds[0]?.fields[0]?.value?.match(
        /(?<=<@&)\d+(?=>)/,
      )?.[0];
    const roles = interaction.member.roles;

    if (!roleId || !(roles instanceof GuildMemberRoleManager))
      return interaction.reply({
        content: `${inlineCode('❌')} 認証中に問題が発生しました。`,
        ephemeral: true,
      });
    if (roles.cache.has(roleId))
      return interaction.reply({
        content: `${inlineCode('✅')} 既に認証されています。`,
        ephemeral: true,
      });

    if (interaction.customId === 'nonick-js:verify-button') {
      return verifyForButtonCaptcha(interaction, roleId);
    }

    if (interaction.customId === 'nonick-js:verify-image') {
      return verifyForImageCaptcha(interaction, roleId);
    }
  },
);

export default [verifyButton];

import { Button } from '@akki256/discord-interaction';
import { Colors, EmbedBuilder, codeBlock, roleMention } from 'discord.js';

const button = new Button(
  { customId: /^nonick-js:roleButton-[0-9]{18,19}/ },
  (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const roleId = interaction.customId.replace('nonick-js:roleButton-', '');
    const roles = interaction.member.roles;

    if (roles.cache.has(roleId))
      roles
        .remove(roleId)
        .then(async () => {
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `\`✅\` ${roleMention(roleId)}の付与を解除しました。`,
                )
                .setColor(Colors.Green),
            ],
            ephemeral: true,
          });
          setTimeout(() => interaction.deleteReply(), 3_000);
        })
        .catch((e) => {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `\`❌\` ロールの付与の解除に失敗しました。\n${codeBlock(e)}`,
                )
                .setColor(Colors.Red),
            ],
            ephemeral: true,
          });
        });
    else
      roles
        .add(roleId)
        .then(async () => {
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`\`✅\` ${roleMention(roleId)}を付与しました。`)
                .setColor(Colors.Green),
            ],
            ephemeral: true,
          });
          setTimeout(() => interaction.deleteReply(), 3_000);
        })
        .catch((e) => {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `\`❌\` ロール付与に失敗しました。\n${codeBlock(e)}`,
                )
                .setColor(Colors.Red),
            ],
            ephemeral: true,
          });
        });
  },
);

module.exports = [button];

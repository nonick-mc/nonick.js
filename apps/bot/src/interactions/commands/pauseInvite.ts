import { ChatInput } from '@akki256/discord-interaction';
import { Duration } from '@modules/format';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  GuildFeature,
  PermissionFlagsBits,
  codeBlock,
  inlineCode,
} from 'discord.js';

export default new ChatInput(
  {
    name: 'pauseinvite',
    description: 'サーバー招待の一時停止状態を切り替えます',
    options: [
      {
        name: 'pause',
        description: '一時停止するか',
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
  },
  { coolTime: Duration.toMS('50s') },
  (interaction) => {
    if (!interaction.inCachedGuild()) return;
    const pause = interaction.options.getBoolean('pause', true);
    const guildFeatures = interaction.guild.features;
    if (guildFeatures.includes(GuildFeature.InvitesDisabled) === pause)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`${inlineCode('❌')} 既にその状態です`)
            .setColor(Colors.Red),
        ],
        ephemeral: true,
      });

    interaction.guild
      .edit(
        pause
          ? {
              features: [...guildFeatures, GuildFeature.InvitesDisabled],
              reason: `招待の一時停止 - ${interaction.user.tag}`,
            }
          : {
              features: guildFeatures.filter(
                (v) => v !== GuildFeature.InvitesDisabled,
              ),
              reason: `招待の有効化 - ${interaction.user.tag}`,
            },
      )
      .then(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${inlineCode('✅')} サーバー招待を${
                  pause ? '一時停止' : '有効に'
                }しました`,
              )
              .setColor(Colors.Green),
          ],
          ephemeral: true,
        });
      })
      .catch((err) => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                [
                  `${inlineCode('❌')} 招待一時停止状態の変更に失敗しました`,
                  codeBlock(err),
                ].join('\n'),
              )
              .setColor(Colors.Red),
          ],
          ephemeral: true,
        });
      });
  },
);

import { ChatInput } from '@akki256/discord-interaction';
import { permissionField } from '@modules/fields';
import { Duration } from '@modules/format';
import { permToText } from '@modules/util';
import {
  ApplicationCommandOptionType,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
  inlineCode,
} from 'discord.js';

export default new ChatInput(
  {
    name: 'ratelimit',
    description: 'このチャンネルの低速モードを設定',
    options: [
      {
        name: 'duration',
        description: '秒数',
        minValue: 0,
        maxValue: 21600,
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
  },
  { coolTime: Duration.toMS('5s') },
  (interaction) => {
    if (!interaction.inCachedGuild() || !interaction.channel) return;

    if (!interaction.appPermissions?.has(PermissionFlagsBits.ManageChannels))
      return interaction.reply({
        content: permissionField(permToText('ManageChannels'), {
          label: 'BOTの権限が不足しています',
        }),
        ephemeral: true,
      });

    const duration = interaction.options.getInteger('duration', true);
    interaction.channel
      .setRateLimitPerUser(duration, `/ratelimit by ${interaction.user.tag}`)
      .then(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${inlineCode('✅')} チャンネルの低速モードを${inlineCode(
                  `${duration}秒`,
                )}に設定しました`,
              )
              .setColor(Colors.Green),
          ],
          ephemeral: true,
        });
      })
      .catch(() => {
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `${inlineCode('❌')} 低速モードの設定に失敗しました`,
              )
              .setColor(Colors.Red),
          ],
        });
      });
  },
);

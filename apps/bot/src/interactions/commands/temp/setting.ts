import { ChatInput } from '@akki256/discord-interaction';
import { dashboard } from '@const/links';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  PermissionFlagsBits,
} from 'discord.js';

export default new ChatInput(
  {
    name: 'setting',
    description: 'BOTの設定を変更します',
    dmPermission: false,
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
  },
  (interaction) => {
    if (!interaction.inCachedGuild()) return;

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('BOTの設定はダッシュボードに移動しました')
          .setDescription(
            `NoNICK.jsの設定は[**Webダッシュボード**](${dashboard})で行えるようになりました！ このコマンドは次回のバージョンで削除され、使用できなくなります。`,
          )
          .setColor(Colors.Blurple),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents([
          new ButtonBuilder()
            .setLabel('ダッシュボード')
            .setURL(`${dashboard}/guilds/${interaction.guild.id}`)
            .setStyle(ButtonStyle.Link),
        ]),
      ],
      ephemeral: true,
    });
  },
);

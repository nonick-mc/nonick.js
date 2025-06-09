import { ChatInput } from '@akki256/discord-interaction';
import { dashboard, document, supportServer } from '@const/links';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
} from 'discord.js';

export default new ChatInput(
  {
    name: 'help',
    description: 'このBOTについて',
  },
  async (interaction) => {
    const developer =
      await interaction.client.users.fetch('735110742222831657');

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(interaction.client.user.username)
          .setDescription(
            [
              '**あなたのDiscordサーバーをもっと便利に！**',
              '「使いやすい多機能BOT」を目指して日々開発しています。',
            ].join('\n'),
          )
          .setImage(
            'https://media.discordapp.net/attachments/958791423161954445/1301505081526714480/banner.png',
          )
          .setColor(Colors.Blurple)
          .setFooter({
            text: `開発者: @${developer.username}`,
            iconURL: developer.displayAvatarURL(),
          }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel('サポートサーバー')
            .setStyle(ButtonStyle.Link)
            .setURL(supportServer),
          new ButtonBuilder()
            .setLabel('使い方ガイド')
            .setStyle(ButtonStyle.Link)
            .setURL(document),
          new ButtonBuilder()
            .setLabel('ダッシュボード')
            .setStyle(ButtonStyle.Link)
            .setURL(dashboard),
        ),
      ],
      ephemeral: true,
    });
  },
);

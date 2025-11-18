import { stripIndents } from 'common-tags';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';
import { execute, Slash } from 'sunar';
import { Links } from '../lib/constants.js';

export const slash = new Slash({
  name: 'help',
  description: 'このBotについて',
});

execute(slash, async (interaction) => {
  const developer = await interaction.client.users.fetch('735110742222831657');

  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(interaction.client.user.username)
        .setDescription(stripIndents`
          あなたのDiscordサーバーをもっと便利に!
          サーバー運営のサポートに特化した次世代のDiscordBotです。
        `)
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
          .setURL(Links.SupportServer),
        new ButtonBuilder().setLabel('使い方ガイド').setStyle(ButtonStyle.Link).setURL(Links.Docs),
        new ButtonBuilder()
          .setLabel('ダッシュボード')
          .setStyle(ButtonStyle.Link)
          .setURL(Links.Dashboard),
      ),
    ],
    ephemeral: true,
  });
});

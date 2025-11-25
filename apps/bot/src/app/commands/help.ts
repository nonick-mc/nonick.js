import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder } from 'discord.js';
import { execute, Slash } from 'sunar';
import { Links } from '@/constants/links.js';

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
        .setURL(Links.homepage)
        .setDescription('サーバー運営のサポートに特化した次世代のDiscordBot。')
        .setImage('https://cdn.nonick-js.com/banner.png')
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
          .setURL(Links.supportServer),
        new ButtonBuilder()
          .setLabel('使い方ガイド')
          .setStyle(ButtonStyle.Link)
          .setURL(Links.document),
        new ButtonBuilder()
          .setLabel('ダッシュボード')
          .setStyle(ButtonStyle.Link)
          .setURL(Links.dashboard),
      ),
    ],
    ephemeral: true,
  });
});

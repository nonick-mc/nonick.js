import { stripIndents } from 'common-tags';
import {
  ContainerBuilder,
  HeadingLevel,
  heading,
  hyperlink,
  inlineCode,
  MessageFlags,
  TextDisplayBuilder,
  unorderedList,
} from 'discord.js';
import { Button, execute } from 'sunar';

export const button = new Button({
  id: 'show-guild-features',
});

execute(button, async (interaction) => {
  if (!interaction.inCachedGuild()) return;

  await interaction.reply({
    components: [
      new ContainerBuilder().addTextDisplayComponents(
        new TextDisplayBuilder().setContent(stripIndents`
          このサーバーに追加されている機能(feature)の一覧です。
          それぞれの機能に関する説明は${hyperlink('Discord開発者ドキュメント', 'https://docs.discord.com/developers/resources/guild#guild-object-guild-features')}で確認できます。
        `),
        new TextDisplayBuilder().setContent(
          unorderedList(interaction.guild.features.map((feature) => inlineCode(feature))),
        ),
      ),
    ],
    flags: [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral],
  });
});

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  HeadingLevel,
  heading,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from 'discord.js';
import { execute, Modal } from 'sunar';
import { danger, getBotEmoji, success } from '@/constants/emojis.js';

export const modal = new Modal({
  id: 'create-verification-panel',
});

execute(modal, async (interaction) => {
  if (!interaction.inGuild() || !interaction.channel?.isSendable()) return;
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const title = interaction.fields.getTextInputValue('title');
  const description = interaction.fields.getTextInputValue('description');
  const buttonLabel = interaction.fields.getTextInputValue('button-label');

  const container = new ContainerBuilder()
    .addTextDisplayComponents([
      new TextDisplayBuilder().setContent(heading(title, HeadingLevel.Two)),
    ])
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
    )
    .addTextDisplayComponents([new TextDisplayBuilder().setContent(description)])
    .addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
    );

  interaction.channel
    .send({
      components: [
        container.addActionRowComponents(
          new ActionRowBuilder<ButtonBuilder>().setComponents([
            new ButtonBuilder()
              .setCustomId('verify')
              .setLabel(buttonLabel)
              .setStyle(ButtonStyle.Success),
          ]),
        ),
      ],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [] },
    })
    .then(() =>
      interaction.followUp({
        content: `${getBotEmoji(success.circleCheck)} 認証パネルを作成しました！`,
      }),
    )
    .catch(() =>
      interaction.followUp({
        content: `${getBotEmoji(danger.circleX)} 認証パネルの送信中に問題が発生しました。再度お試しください。`,
      }),
    );
});

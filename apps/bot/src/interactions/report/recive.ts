import { Button, Modal } from '@akki256/discord-interaction';
import { report } from '@database/src/schema/report';
import { db } from '@modules/drizzle';
import {
  ActionRowBuilder,
  type ButtonInteraction,
  ChannelType,
  Colors,
  ComponentType,
  ContainerBuilder,
  EmbedBuilder,
  InteractionType,
  MessageFlags,
  ModalBuilder,
  type ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
  escapeMarkdown,
} from 'discord.js';
import { and, eq } from 'drizzle-orm';

const completeButton = new Button(
  { customId: 'nonick-js:report-completed' },
  (interaction) => closeReport(interaction, true),
);

const ignoreButton = new Button(
  { customId: 'nonick-js:report-ignore' },
  (interaction): void => {
    interaction.showModal(
      new ModalBuilder()
        .setCustomId('nonick-js:report-ignoreReasonModal')
        .setTitle('対応なしとしてマーク')
        .setComponents(
          new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
              .setCustomId('reason')
              .setLabel('対応なしに設定する理由')
              .setMaxLength(100)
              .setStyle(TextInputStyle.Short),
          ),
        ),
    );
  },
);

const ignoreReasonModal = new Modal(
  { customId: 'nonick-js:report-ignoreReasonModal' },
  async (interaction) => {
    const reason = interaction.fields.getTextInputValue('reason');
    closeReport(interaction, false, reason);
  },
);

async function closeReport(
  interaction: ButtonInteraction | ModalSubmitInteraction,
  isCompleted: boolean,
  reason?: string,
) {
  if (!interaction.inCachedGuild()) return;
  if (
    interaction.type === InteractionType.ModalSubmit &&
    !interaction.isFromMessage()
  )
    return;

  const setting = await db.query.reportSetting.findFirst({
    where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
  });
  if (!setting) return;

  const thread = interaction.channel?.isThread()
    ? interaction.channel
    : interaction.message.thread;

  if (!thread?.parentId) return;
  const parentChannelId = thread.parentId;

  const container = interaction.message.components[0];
  if (container.type !== ComponentType.Container) return;

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${interaction.user.username}が報告を${isCompleted ? '対応済み' : '対応なし'}としてマークしました`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setColor(isCompleted ? Colors.Green : Colors.Red);
  if (!isCompleted)
    embed.setFooter({ text: `理由: ${escapeMarkdown(reason ?? '')}` });

  await interaction.update({
    components: [
      new ContainerBuilder(container.toJSON()).setAccentColor(
        isCompleted ? Colors.Green : Colors.Red,
      ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });

  if (
    thread.parent?.type === ChannelType.GuildForum &&
    thread.parentId === setting.channel
  ) {
    if (isCompleted && setting.forumCompletedTag)
      await thread
        .setAppliedTags([...thread.appliedTags, setting.forumCompletedTag])
        .catch(() => {});
    if (!isCompleted && setting.forumIgnoredTag)
      await thread
        .setAppliedTags([...thread.appliedTags, setting.forumIgnoredTag])
        .catch(() => {});
  }

  await db
    .delete(report)
    .where(
      and(
        eq(report.guildId, interaction.guildId),
        eq(report.channelId, parentChannelId),
        eq(report.threadId, thread.id),
      ),
    );

  await thread
    .send({
      embeds: [embed],
    })
    .then(async () => {
      await thread.setLocked();
      thread.setArchived();
    });
}

export default [completeButton, ignoreButton, ignoreReasonModal];

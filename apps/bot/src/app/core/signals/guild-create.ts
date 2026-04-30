import { guild as guildTable } from '@repo/database';
import { stripIndents } from 'common-tags';
import {
  ActionRowBuilder,
  AuditLogEvent,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  Events,
  HeadingLevel,
  heading,
  hyperlink,
  inlineCode,
  MessageFlags,
  PermissionFlagsBits,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} from 'discord.js';
import { execute, Signal } from 'sunar';
import { getAppEmoji, Success } from '@/src/constants/emoji';
import { Link } from '@/src/constants/link';
import { db } from '@/src/lib/db';

export const signal = new Signal(Events.GuildCreate);

execute(signal, async (guild) => {
  await db.insert(guildTable).values({ id: guild.id }).onConflictDoNothing();

  // Botを導入したユーザーにウェルカムメッセージを送信する
  // 監査ログの閲覧権限がない場合は、サーバーのオーナーに送信する
  let recipient = await guild.fetchOwner().then((owner) => owner.user);

  if (guild.members.me?.permissions.has(PermissionFlagsBits.ViewAuditLog)) {
    const auditLogEntry = await guild
      .fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd })
      .then((logs) => logs.entries.first());

    if (auditLogEntry?.targetId === guild.client.user.id && auditLogEntry.executor) {
      recipient = await auditLogEntry.executor?.fetch();
    }
  }

  recipient.send({
    components: [
      new ContainerBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            heading(
              `${getAppEmoji(Success.circleCheck)} ${inlineCode(guild.name)} の追加に成功しました！`,
              HeadingLevel.Three,
            ),
          ),
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
        )
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            stripIndents`
            ${guild.client.user.username}を導入していただきありがとうございます。
            搭載されている一部機能を使用するためには、${hyperlink('ダッシュボード', `${Link.dashboard}/guilds/${guild.id}`)}から設定を行う必要があります。
            それぞれの機能の詳細については、${hyperlink('ドキュメント', Link.docs)}を閲覧してください。
          `,
          ),
        )
        .addSeparatorComponents(
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
        )
        .addActionRowComponents(
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder()
              .setLabel('サポートサーバーに参加する')
              .setURL(Link.discord)
              .setStyle(ButtonStyle.Link),
          ),
        ),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
});

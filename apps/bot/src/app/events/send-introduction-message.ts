import {
  ActionRowBuilder,
  AuditLogEvent,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
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
import { execute, Signal, Signals } from 'sunar';
import { getBotEmoji, success } from '@/constants/emojis.js';
import { Links } from '@/constants/links.js';

export const signal = new Signal(Signals.GuildCreate);

execute(signal, async (guild) => {
  if (!guild.members.me?.permissions.has(PermissionFlagsBits.ViewAuditLog)) return;

  const auditLogs = await guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.BotAdd,
  });

  const entry = auditLogs.entries.first();
  if (entry?.targetId !== guild.client.user.id) return;

  entry.executor?.send({
    components: [
      new ContainerBuilder()
        .addTextDisplayComponents([
          new TextDisplayBuilder().setContent(
            heading(
              `${getBotEmoji(success.circleCheck)} ${inlineCode(guild.name)} の追加に成功しました！`,
              HeadingLevel.Three,
            ),
          ),
        ])
        .addSeparatorComponents([
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
        ])
        .addTextDisplayComponents([
          new TextDisplayBuilder().setContent(
            [
              'NoNICK.jsを採用していただきありがとうございます。',
              `搭載されている一部機能を使用するためには、${hyperlink('ダッシュボード', `${Links.dashboard}/guilds/${guild.id}`)}から設定を行う必要があります。`,
              `それぞれの機能の詳細については、${hyperlink('ドキュメント', Links.document)}を閲覧してください。`,
            ].join('\n'),
          ),
        ])
        .addSeparatorComponents([
          new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
        ])
        .addActionRowComponents([
          new ActionRowBuilder<ButtonBuilder>().setComponents([
            new ButtonBuilder()
              .setLabel('サポートサーバーに参加する')
              .setURL(Links.supportServer)
              .setStyle(ButtonStyle.Link),
          ]),
        ]),
    ],
    flags: MessageFlags.IsComponentsV2,
  });
});

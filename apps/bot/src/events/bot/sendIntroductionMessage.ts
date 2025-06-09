import { success } from '@const/emojis';
import { dashboard, document, supportServer } from '@const/links';
import { DiscordEventBuilder } from '@modules/events';
import { formatEmoji } from '@modules/util';
import {
  ActionRowBuilder,
  AuditLogEvent,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  Events,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  hyperlink,
  inlineCode,
} from 'discord.js';

export default new DiscordEventBuilder({
  type: Events.GuildCreate,
  async execute(guild) {
    const auditLogs = await guild
      .fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.BotAdd,
      })
      .catch(() => null);
    if (!auditLogs) return;

    const entry = auditLogs.entries.first();
    if (!entry || entry.targetId !== guild.client.user.id) return;

    entry.executor?.send({
      components: [
        new ContainerBuilder()
          .addTextDisplayComponents([
            new TextDisplayBuilder().setContent(
              `### ${formatEmoji(success)} ${inlineCode(guild.name)} の追加に成功しました！`,
            ),
          ])
          .addSeparatorComponents([
            new SeparatorBuilder()
              .setSpacing(SeparatorSpacingSize.Small)
              .setDivider(false),
          ])
          .addTextDisplayComponents([
            new TextDisplayBuilder().setContent(
              [
                'NoNICK.jsを採用していただきありがとうございます。',
                `搭載されている一部機能を使用するためには、${hyperlink('ダッシュボード', `${dashboard}/guilds/${guild.id}`)}から設定を行う必要があります。`,
                `それぞれの機能の詳細については、${hyperlink('ドキュメント', document)}を閲覧してください。`,
              ].join('\n'),
            ),
          ])
          .addSeparatorComponents([
            new SeparatorBuilder()
              .setSpacing(SeparatorSpacingSize.Small)
              .setDivider(false),
          ])
          .addActionRowComponents([
            new ActionRowBuilder<ButtonBuilder>().setComponents([
              new ButtonBuilder()
                .setLabel('サポートサーバーに参加する')
                .setURL(supportServer)
                .setStyle(ButtonStyle.Link),
            ]),
          ]),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  },
});

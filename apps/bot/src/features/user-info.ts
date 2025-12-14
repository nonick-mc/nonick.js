import { stripIndents } from 'common-tags';
import {
  ContainerBuilder,
  escapeInlineCode,
  type GuildMember,
  HeadingLevel,
  heading,
  hyperlink,
  inlineCode,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  ThumbnailBuilder,
  time,
  type User,
  UserFlags,
  underline,
} from 'discord.js';
import { danger, defaultColor, getBotEmoji, other, userFlag } from '@/constants/emojis.js';
import { customField, idField, scheduleField } from '@/lib/fields.js';

export async function getUserInfoComponent(user: User, member?: GuildMember | null) {
  const badges = user.flags?.toArray().flatMap((flag) => {
    const emoji = userFlag[flag as keyof typeof userFlag];
    if (!emoji) return [];
    return getBotEmoji(emoji);
  });

  const container = new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        heading(user.globalName ?? user.username, HeadingLevel.Three),
      ),
    )
    .addSeparatorComponents(new SeparatorBuilder().setDivider(false));

  if (user.flags?.has(UserFlags.Spammer | UserFlags.Quarantined)) {
    container
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `${getBotEmoji(danger.circleAlert)} このユーザーはDiscordから${hyperlink('不審なユーザー', 'https://support.discord.com/hc/articles/6461420677527-Quarantine-FAQ')}としてフラグされています。`,
        ),
      )
      .addSeparatorComponents(new SeparatorBuilder().setDivider(false));
  }

  container.addSectionComponents(
    new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(stripIndents`
            ${idField('ユーザーID', user.id)}
            ${customField('ユーザー名', inlineCode(escapeInlineCode(user.username)), defaultColor.idCard)}
            ${customField('バッジ', badges?.join('') || 'なし', defaultColor.award)}
            ${scheduleField('アカウント作成日時', user.createdAt)}
          `),
      )
      .setThumbnailAccessory(new ThumbnailBuilder().setURL(user.displayAvatarURL())),
  );

  if (member) {
    container
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(stripIndents`
          ${customField('サーバー参加日時', member.joinedAt ? time(member.joinedAt) : '不明', defaultColor.calenderDays)}
          ${customField('ブースト開始日時', member.premiumSince ? time(member.premiumSince) : underline('なし'), other.boost)}
          ${customField(
            'ロール',
            `${
              member.roles.cache
                .filter((role) => role.id !== role.guild.id)
                .sort((a, b) => b.position - a.position)
                .map((role) => role.toString())
                .join(' ') || 'なし'
            }`,
            defaultColor.shieldUser,
          )}
        `),
      );
  }

  return container;
}

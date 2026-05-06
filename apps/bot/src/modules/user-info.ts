import {
  Colors,
  ContainerBuilder,
  escapeInlineCode,
  escapeMarkdown,
  type GuildMember,
  HeadingLevel,
  heading,
  inlineCode,
  SectionBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  subtext,
  TextDisplayBuilder,
  ThumbnailBuilder,
  TimestampStyles,
  time,
  type User,
  underline,
} from 'discord.js';
import { Destructive, getAppEmoji } from '@/src/constants/emoji';
import { unorderedListTable } from '@/src/lib/format';

export function getUserInfoContainer(user: User) {
  return new ContainerBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(heading(`${user} の情報`, HeadingLevel.Three)),
    )
    .addSectionComponents(
      new SectionBuilder()
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(user.displayAvatarURL()))
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            unorderedListTable([
              {
                label: '表示名',
                value: inlineCode(
                  user.globalName ? escapeInlineCode(user.globalName) : user.username,
                ),
              },
              { label: 'ユーザー名', value: inlineCode(user.tag) },
              { label: 'ユーザーID', value: inlineCode(user.id) },
              {
                label: 'タグ',
                value: user.primaryGuild?.tag
                  ? inlineCode(user.primaryGuild.tag)
                  : underline('なし'),
              },
              {
                label: 'アカウント作成日',
                value: time(user.createdAt, TimestampStyles.LongDate),
              },
            ]),
          ),
        ),
    );
}

export function getMemberInfoContainers(member: GuildMember, showModerateInfo = false) {
  const components = [];

  if (showModerateInfo && member.isCommunicationDisabled()) {
    components.push(
      new ContainerBuilder()
        .setAccentColor(Colors.Red)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(
            `${getAppEmoji(Destructive.shieldAlert)} このユーザーは${time(member.communicationDisabledUntil, TimestampStyles.ShortDateMediumTime)}までタイムアウトされています`,
          ),
        ),
    );
  }

  const userInfoContainer = getUserInfoContainer(member.user)
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large))
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(subtext(`${member.guild} での情報`)),
    );

  const memberInfoTextDisplay = new TextDisplayBuilder().setContent(
    unorderedListTable([
      {
        label: 'ニックネーム',
        value: member.nickname ?? underline('なし'),
      },
      {
        label: 'サーバー参加日',
        value: member.joinedAt ? time(member.joinedAt, TimestampStyles.LongDate) : '不明',
      },
      {
        label: 'サーバーブースト開始日',
        value: member.premiumSince
          ? time(member.premiumSince, TimestampStyles.LongDate)
          : underline('なし'),
      },
      {
        label: 'ロール',
        value:
          member.roles.cache
            .filter((role) => role.id !== role.guild.id)
            .sort((a, b) => b.position - a.position)
            .map((role) => role.toString())
            .join(' ') || underline('なし'),
      },
    ]),
  );

  if (member.avatarURL()) {
    userInfoContainer.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(memberInfoTextDisplay)
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(member.avatarURL() as string)),
    );
  } else {
    userInfoContainer.addTextDisplayComponents(memberInfoTextDisplay);
  }

  components.push(userInfoContainer);
  return components;
}

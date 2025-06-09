import { type EmojiColors, type Emojis, getColorEmoji } from '@const/emojis';
import { bold, escapeMarkdown, inlineCode, time } from 'discord.js';
import type {
  Channel,
  DMChannel,
  GuildMember,
  PartialDMChannel,
  PartialGroupDMChannel,
  User,
} from 'discord.js';
import { formatEmoji } from './util';

interface UserFieldOption {
  color: EmojiColors<'member'>;
  label: string;
}

interface UserFieldWithEmojiOption<T extends Emojis> extends UserFieldOption {
  emoji: T;
  color: EmojiColors<T>;
}

interface NicknameOption {
  color: EmojiColors<'member'>;
  label: string;
}

interface TextFieldOption {
  color: EmojiColors<'text'>;
  label: string;
}

interface ScheduleFieldOption {
  color: EmojiColors<'schedule'>;
  label: string;
}

interface ChannelFieldOption {
  color: EmojiColors<'channel'>;
  label: string;
}

interface IdFieldOption {
  color: EmojiColors<'id'>;
  label: string;
}

interface PermissionFieldOption {
  label: string;
}

interface CountFieldOption<T extends Emojis> {
  emoji: T;
  color: EmojiColors<T>;
  label: string;
}

export function userField(
  user: User,
  options?: Partial<UserFieldOption>,
): string;
export function userField<T extends Emojis>(
  user: User,
  options: UserFieldWithEmojiOption<T>,
): string;
export function userField<T extends Emojis>(
  user: User,
  options?: Partial<UserFieldOption> | UserFieldWithEmojiOption<T>,
) {
  if (options && 'emoji' in options) {
    return `${formatEmoji(getColorEmoji<T>(options.emoji, options.color) as string)} ${bold(
      `${options.label}:`,
    )} ${user.toString()} [${inlineCode(user.tag)}]`;
  }

  const option: UserFieldOption = {
    label: 'ユーザー',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('member', option.color))} ${bold(
    `${option.label}:`,
  )} ${user.toString()} [${inlineCode(user.tag)}]`;
}

export function nicknameField(
  member: GuildMember,
  options?: Partial<NicknameOption>,
) {
  const option: NicknameOption = {
    label: 'ユーザー',
    color: 'white',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('member', option.color))} ${bold(
    `${option.label}:`,
  )} ${bold(escapeMarkdown(member.nickname ?? 'なし'))}`;
}

export function textField(text: string, options?: Partial<TextFieldOption>) {
  const option: TextFieldOption = {
    label: 'ユーザー',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('text', option.color))} ${bold(
    `${option.label}:`,
  )} ${text}`;
}

export function scheduleField(
  date: Date | number,
  options?: Partial<ScheduleFieldOption>,
) {
  const d = typeof date === 'number' ? new Date(date) : date;
  const option: ScheduleFieldOption = {
    label: '時間',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('schedule', option.color))} ${bold(
    `${option.label}:`,
  )} ${time(d)}`;
}

export function channelField(
  channel: Exclude<
    Channel,
    DMChannel | PartialDMChannel | PartialGroupDMChannel
  >,
  options?: Partial<ChannelFieldOption>,
) {
  const option: ChannelFieldOption = {
    label: 'チャンネル',
    color: 'gray',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('channel', option.color))} ${bold(
    `${option.label}:`,
  )} ${channel.toString()} [${inlineCode(channel.name)}]`;
}

export function idField(id: string, options?: Partial<IdFieldOption>) {
  const option: IdFieldOption = {
    label: 'ID',
    color: 'white',
    ...options,
  };
  return `${formatEmoji(getColorEmoji('id', option.color))} ${bold(
    `${option.label}:`,
  )} ${inlineCode(id)}`;
}

export function permissionField(
  permissions: string[],
  options?: PermissionFieldOption,
) {
  const option: PermissionFieldOption = {
    label: '権限がありません',
    ...options,
  };
  return `${inlineCode('❌')} ${bold(`${option.label}${permissions.length ? ':' : ''}`)}${
    permissions.length ? ` ${permissions.join('\n')}` : ''
  }`;
}

export function countField<T extends Emojis>(
  count: number,
  options: CountFieldOption<T>,
) {
  return `${formatEmoji(
    getColorEmoji(options.emoji, options.color) as string,
  )} ${options.label}: ${inlineCode(count.toString())}`;
}

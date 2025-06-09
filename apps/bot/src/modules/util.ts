import AdmZip from 'adm-zip';
import axios from 'axios';
import { AttachmentBuilder, PermissionFlagsBits } from 'discord.js';
import type {
  Attachment,
  Collection,
  Guild,
  Message,
  PermissionFlags,
  Snowflake,
} from 'discord.js';
import { client } from '../index';

export async function getMessage(
  ...id: [guildId: string, channelId: string, messageId: string]
): Promise<Message>;
export async function getMessage(
  ...id: [channelId: string, messageId: string]
): Promise<Message>;
export async function getMessage(...id: string[]): Promise<Message> {
  const [messageId, channelId, guildId = null] = id.slice(0, 3).reverse();
  const guild = guildId
    ? await client.guilds.fetch(guildId).catch(() => null)
    : client;
  if (!guild) throw new URIError(`サーバーID:\`${guildId}\`に入っていません`);
  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel?.isTextBased())
    throw new URIError(
      `チャンネルID:\`${channelId}\`が存在しないもしくはアクセスできません`,
    );
  const message = await channel.messages.fetch(messageId).catch(() => {});
  if (!message)
    throw new URIError(
      `メッセージID:\`${messageId}\`が存在しないもしくはアクセスできません`,
    );
  return message;
}

export function formatEmoji<C extends Snowflake>(
  emojiId: C,
  animated?: false,
): `<:x:${C}>`;
export function formatEmoji<C extends Snowflake>(
  emojiId: C,
  animated?: true,
): `<a:x:${C}>`;
export function formatEmoji<C extends Snowflake>(
  emojiId: C,
  animated?: boolean,
): `<:x:${C}>` | `<a:x:${C}>`;
export function formatEmoji(emojiId: string, animated = false) {
  return `<${animated ? 'a' : ''}:x:${emojiId}>`;
}

export function range(max: number): Generator<number>;
export function range(min: number, max: number): Generator<number>;
export function* range(_min: number, _max = 0) {
  const [min, max] = _min < _max ? [_min, _max] : [_max, _min];
  for (let i = min; i < max; i++) yield i;
}

export async function createAttachment(
  attachments: Collection<string, Attachment>,
) {
  if (!attachments.size) return;
  const zip = new AdmZip();
  for await (const attachment of attachments.values()) {
    const res = await axios
      .get(attachment.url, { responseType: 'arraybuffer' })
      .catch(() => null);
    if (!res) continue;
    zip.addFile(attachment.name, res.data);
  }
  return new AttachmentBuilder(zip.toBuffer(), { name: 'attachments.zip' });
}

export async function getSendableChannel(guild: Guild, channelId: string) {
  const channel = await guild.channels.fetch(channelId);
  if (!channel?.isTextBased()) throw new TypeError('channel is not TextBased');
  const permissions = guild.members.me?.permissionsIn(channel);
  if (
    !(
      permissions?.has(PermissionFlagsBits.ViewChannel) &&
      permissions.has(PermissionFlagsBits.SendMessages)
    )
  )
    throw new ReferenceError("don't have permission");
  return channel;
}

export const permissionTexts: Record<keyof PermissionFlags, string> = {
  ViewChannel: 'チャンネルを見る',
  ManageChannels: 'チャンネルの管理',
  ManageRoles: 'ロールの管理',
  CreateGuildExpressions: 'エクスプレッションを作成',
  ManageGuildExpressions: '絵文字の管理',
  ManageEmojisAndStickers: '絵文字の管理',
  ViewAuditLog: '監査ログの表示',
  ViewGuildInsights: 'サーバーインサイトを見る',
  ManageWebhooks: 'ウェブフックの管理',
  ManageGuild: 'サーバー管理',

  CreateInstantInvite: '招待の作成',
  ChangeNickname: 'ニックネームの変更',
  ManageNicknames: 'ニックネームの管理',
  KickMembers: 'メンバーをキック',
  BanMembers: 'メンバーをBAN',
  ModerateMembers: 'メンバーをタイムアウト',

  SendMessages: 'メッセージの送信',
  SendMessagesInThreads: 'スレッドでメッセージを送信',
  CreatePublicThreads: '公開スレッドの作成',
  CreatePrivateThreads: 'プレイべーとスレッドの作成',
  EmbedLinks: '埋め込みリンク',
  AttachFiles: 'ファイルを添付',
  AddReactions: 'リアクションの追加',
  UseExternalEmojis: '外部の絵文字を使用する',
  UseExternalStickers: '外部のスタンプを使用する',
  MentionEveryone: '@everyone、@here、全てのロールにメンション',
  ManageMessages: 'メッセージの管理',
  ManageThreads: 'スレッドの管理',
  ReadMessageHistory: 'メッセージ履歴を読む',
  SendTTSMessages: 'テキスト読み上げメッセージを送信する',
  SendVoiceMessages: 'ボイスメッセージを送信',
  SendPolls: '投票を作成',

  Connect: '接続',
  Speak: '発言',
  Stream: 'WEBカカメラ',
  UseSoundboard: 'サウンドボードを使用',
  UseExternalSounds: '外部のサウンドの使用',
  UseVAD: '音声検出を使用',
  PrioritySpeaker: '優先スピーカー',
  MuteMembers: 'メンバーをミュート',
  DeafenMembers: 'メンバーのスピーカーをミュート',
  MoveMembers: 'メンバーを移動',

  UseApplicationCommands: 'アプリコマンドを使う',
  UseEmbeddedActivities: 'ユーザーアクティビティ',
  UseExternalApps: '外部のアプリを使用',

  RequestToSpeak: 'スピーカー参加をリクエスト',

  CreateEvents: 'イベントを作成',
  ManageEvents: 'イベントの管理',

  Administrator: '管理者',

  ViewCreatorMonetizationAnalytics: '収益情報を表示',
};

export function permToText(...perms: (keyof PermissionFlags)[]) {
  return perms.map((v) => permissionTexts[v]);
}

export function isURL(url: string) {
  return /^https?:\/\//.test(url);
}

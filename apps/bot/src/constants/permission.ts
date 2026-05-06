import type { PermissionFlags } from 'discord.js';

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
  PinMessages: 'メッセージをピン留め',
  ManageThreads: 'スレッドの管理',
  ReadMessageHistory: 'メッセージ履歴を読む',
  SendTTSMessages: 'テキスト読み上げメッセージを送信する',
  SendVoiceMessages: 'ボイスメッセージを送信',
  SendPolls: '投票を作成',
  BypassSlowmode: '低速モードをバイパス',

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

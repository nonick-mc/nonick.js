import { SlashParent } from 'sunar';

export const info = new SlashParent({
  name: 'info',
  description: 'サーバーやユーザーの詳細な情報を確認',
  dmPermission: false,
});

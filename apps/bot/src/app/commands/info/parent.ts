import { ApplicationIntegrationType, InteractionContextType } from 'discord.js';
import { SlashParent } from 'sunar';

export const slashParent = new SlashParent({
  name: 'info',
  description: 'ユーザーやサーバーの情報を表示します',
  integrationTypes: [ApplicationIntegrationType.GuildInstall],
  contexts: [InteractionContextType.Guild],
});

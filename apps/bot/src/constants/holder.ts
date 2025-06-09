import { PlaceHolder } from '@modules/format';
import { type Guild, type User, escapeMarkdown } from 'discord.js';

export const joinAndLeaveHolder = new PlaceHolder<{
  guild: Guild;
  user: User;
}>()
  .register('serverName', ({ guild }) =>
    guild?.name ? escapeMarkdown(guild.name) : null,
  )
  .register('memberCount', ({ guild }) => guild?.memberCount)
  .register('user', ({ user }) => user?.toString())
  .register('userName', ({ user }) =>
    user?.username ? escapeMarkdown(user.username) : null,
  )
  .register('userTag', ({ user }) =>
    user?.tag ? escapeMarkdown(user.tag) : null,
  );

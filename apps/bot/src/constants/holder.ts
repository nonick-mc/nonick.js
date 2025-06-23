import { escapeMarkdown, type Guild, type User } from 'discord.js';
import { PlaceHolder } from '@/modules/format';

export const joinAndLeaveHolder = new PlaceHolder<{
  guild: Guild;
  user: User;
}>()
  .register('serverName', ({ guild }) => (guild?.name ? escapeMarkdown(guild.name) : null))
  .register('memberCount', ({ guild }) => guild?.memberCount)
  .register('user', ({ user }) => user?.toString())
  .register('userName', ({ user }) => (user?.username ? escapeMarkdown(user.username) : null))
  .register('userTag', ({ user }) => (user?.tag ? escapeMarkdown(user.tag) : null));

export const levelUpMessageHolder = new PlaceHolder<{
  user: User;
  level: number;
  xp: number;
}>()
  .register('user', ({ user }) => user?.toString())
  .register('userName', ({ user }) => (user?.username ? escapeMarkdown(user.username) : null))
  .register('userId', ({ user }) => (user?.id ? escapeMarkdown(user.id) : null))
  .register('level', ({ level }) => `${level}`)
  .register('xp', ({ xp }) => `${xp}`);

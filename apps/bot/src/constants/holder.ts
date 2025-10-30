import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { escapeMarkdown, type Guild, type GuildMember, type User } from 'discord.js';
import { PlaceHolder } from '@/modules/format';

dayjs.locale('ja');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export const joinAndLeaveHolder = new PlaceHolder<{
  guild: Guild;
  user: User;
}>()
  .register('serverName', ({ guild }) => (guild?.name ? escapeMarkdown(guild.name) : null))
  .register('memberCount', ({ guild }) => guild?.memberCount)
  .register('user', ({ user }) => user?.toString())
  .register('userName', ({ user }) => (user?.username ? escapeMarkdown(user.username) : null))
  .register('userTag', ({ user }) => (user?.tag ? escapeMarkdown(user.tag) : null));

export const autoCreateThreadHolder = new PlaceHolder<{
  member: GuildMember | null;
  user: User;
  createdAt: Date;
}>()
  .register('username', ({ user }) => user?.username ?? null)
  .register('globalName', ({ user }) => user?.globalName ?? user?.username ?? null)
  .register(
    'displayName',
    ({ member, user }) => member?.displayName ?? user?.globalName ?? user?.username ?? null,
  )
  .register('createdAt', ({ createdAt }) => dayjs(createdAt).format('YYYY-MM-DD HH:mm'))
  .register('createdAt_date', ({ createdAt }) => dayjs(createdAt).format('YYYY-MM-DD'))
  .register('createdAt_time', ({ createdAt }) => dayjs(createdAt).format('HH:mm'));

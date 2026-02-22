import { ActivityType } from 'discord.js';
import { CronBuilder } from '@/modules/cron';
import { client } from '../index';

export default new CronBuilder({ hour: 0, minute: 0 }, async () => {
  const guildCount = (await client.application?.fetch())?.approximateGuildCount;
  client.user?.setActivity({
    name: `/help | ${guildCount} servers`,
    type: ActivityType.Custom,
  });
});

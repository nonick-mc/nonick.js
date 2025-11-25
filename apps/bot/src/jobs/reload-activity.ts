import { ActivityType } from 'discord.js';
import { client } from '@/index.js';
import { CronBuilder } from '@/lib/cron.js';

export default new CronBuilder({ hour: 0, minute: 0 }, async () => {
  if (!client.isReady()) return;

  client.user.setActivity({
    name: `/help | ${(await client.application?.fetch())?.approximateGuildCount} サーバー`,
    type: ActivityType.Custom,
  });
});

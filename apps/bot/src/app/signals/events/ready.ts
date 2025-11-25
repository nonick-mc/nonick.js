import { ActivityType, version } from 'discord.js';
import { execute, Signal, Signals } from 'sunar';
import { registerCommands } from 'sunar/registry';

export const signal = new Signal(Signals.ClientReady, { once: true });

execute(signal, async (client) => {
  if (process.argv.includes('--register')) {
    await registerCommands(client.application);
    console.log('[INFO] Commands registered');
  }

  console.log('[INFO] BOT ready!');
  console.table({
    'Bot User': client.user?.tag,
    Guilds: `${client.guilds.cache.size} Servers`,
    Watching: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${version}`,
    'Node.js': process.version,
  });

  client.user.setActivity({
    name: `/help | ${(await client.application?.fetch())?.approximateGuildCount} サーバー`,
    type: ActivityType.Custom,
  });
});

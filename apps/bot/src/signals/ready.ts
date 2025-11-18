import { ActivityType, version } from 'discord.js';
import { execute, Signal, Signals } from 'sunar';
import { registerCommands, registerGuildCommands } from 'sunar/registry';

export const signal = new Signal(Signals.ClientReady, { once: true });

execute(signal, async (client) => {
  if (process.env.DEV_GUILD_ID) {
    console.log('[INFO] Registering guild commands for development guild...');
    await registerGuildCommands(client.application, [process.env.DEV_GUILD_ID]);
  } else {
    console.log('[INFO] Registering global commands...');
    await registerCommands(client.application);
  }

  client.user?.setActivity({
    name: `/help | ${(await client.application?.fetch())?.approximateGuildCount} servers`,
    type: ActivityType.Competing,
  });

  console.log('[INFO] BOT ready!');
  console.table({
    'Bot User': client.user?.tag,
    Guilds: `${client.guilds.cache.size} Servers`,
    Watching: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${version}`,
    'Node.js': process.version,
  });
});

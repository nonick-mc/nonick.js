import { ActivityType, version } from 'discord.js';
import { execute, Signal, Signals } from 'sunar';
import { registerCommands, registerGuildCommands } from 'sunar/registry';

export const signal = new Signal(Signals.ClientReady, { once: true });

execute(signal, async (client) => {
  if (process.env.GUILD_ID) {
    await registerGuildCommands(client.application, [process.env.GUILD_ID]);
  } else {
    await registerCommands(client.application);
  }

  console.log('[INFO] BOT ready!');
  console.table({
    'Bot User': client.user?.tag,
    Guilds: `${client.guilds.cache.size} Servers`,
    Emojis: `${client.application.emojis.cache.size} Emojis`,
    Watching: `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} Members`,
    'Discord.js': `v${version}`,
    'Node.js': process.version,
  });

  client.user.setActivity({
    name: `/help | ${(await client.application?.fetch())?.approximateGuildCount} サーバー`,
    type: ActivityType.Custom,
  });
});

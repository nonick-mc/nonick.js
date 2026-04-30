import { Events, version } from 'discord.js';
import pc from 'picocolors';
import { execute, Signal } from 'sunar';
import { registerCommands } from 'sunar/registry';

export const signal = new Signal(Events.ClientReady, {
  once: true,
});

execute(signal, async (client) => {
  console.log(pc.bold(pc.green('Bot Ready!')));
  console.log('- Bot User:'.padEnd(15), client.user.tag);
  console.log('- Discord.js:'.padEnd(15), `v${version}`, '\n');

  await client.application.emojis.fetch();
  console.log(
    pc.green('✓'),
    'Emojis fetched',
    pc.gray(`(${client.application.emojis.cache.size} emojis)`),
  );

  if (process.argv.includes('--register')) {
    await registerCommands(client.application);
    console.log(pc.green('✓'), 'Commands registered');
  }
});

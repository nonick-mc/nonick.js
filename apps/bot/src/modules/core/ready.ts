import { Events } from 'discord.js';
import { execute, Signal } from 'sunar';

export const signal = new Signal(Events.ClientReady, {
  once: true,
});

execute(signal, (client) => {
  console.log('ready!');
});

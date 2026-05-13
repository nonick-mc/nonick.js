import { Events } from 'discord.js';
import { execute, Signal } from 'sunar';

export const signal = new Signal(Events.Error);

execute(signal, (error) => {
  return console.error(error);
});

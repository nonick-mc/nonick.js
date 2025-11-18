import { execute, Signal, Signals } from 'sunar';
import { handleInteraction } from 'sunar/handlers';

export const signal = new Signal(Signals.InteractionCreate);

execute(signal, async (interaction) => {
  await handleInteraction(interaction);
});

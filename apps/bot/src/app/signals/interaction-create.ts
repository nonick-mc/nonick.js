import { Events } from 'discord.js';
import { execute, Signal } from 'sunar';
import { handleInteraction } from 'sunar/handlers';

export const interactionCreateSignal = new Signal(Events.InteractionCreate);

execute(interactionCreateSignal, async (interaction) => {
  await handleInteraction(interaction);
});

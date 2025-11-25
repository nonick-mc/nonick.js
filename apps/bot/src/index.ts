import 'dotenv/config';

import { AllowedMentionsTypes, GatewayIntentBits, Partials } from 'discord.js';
import { Client, dirname, load } from 'sunar';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User],
  allowedMentions: {
    parse: [AllowedMentionsTypes.Role, AllowedMentionsTypes.User],
  },
});

const start = async () => {
  const base = dirname(import.meta.url);
  await load(`${base.split('/').at(-1)}/app/{commands,signals}/**/*.{js,ts}`);
  client.login();
};

start();

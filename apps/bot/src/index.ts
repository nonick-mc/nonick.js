import 'dotenv/config';

import { GatewayIntentBits } from 'discord.js';
import { Client, dirname, load } from 'sunar';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

const base = dirname(import.meta.url);
const baseDir = base.split('/').at(-1);

await load(`${baseDir}/modules/**/*.{mjs,ts}`);

client.login();

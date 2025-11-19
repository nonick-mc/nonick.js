import { guild as guildSchema } from '@repo/database';
import { execute, Signal, Signals } from 'sunar';
import { db } from '@/lib/drizzle.js';

export const signal = new Signal(Signals.GuildCreate);

execute(signal, async (guild) => {
  await db.insert(guildSchema).values({ id: guild.id }).onConflictDoNothing();
});

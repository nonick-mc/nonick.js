import { guild as guildSchema } from '@repo/database';
import { eq } from 'drizzle-orm';
import { execute, Signal, Signals } from 'sunar';
import { db } from '@/lib/drizzle.js';

export const signal = new Signal(Signals.GuildDelete);

execute(signal, async (guild) => {
  await db.delete(guildSchema).where(eq(guildSchema.id, guild.id));
});

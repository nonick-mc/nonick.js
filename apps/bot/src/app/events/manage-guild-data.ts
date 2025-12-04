import { guild as guildTable } from '@repo/database';
import { eq } from 'drizzle-orm';
import { execute, Signal, Signals } from 'sunar';
import { db } from '@/lib/drizzle.js';

export const guildCreateSignal = new Signal(Signals.GuildCreate);

execute(guildCreateSignal, async (guild) => {
  await db.insert(guildTable).values({ id: guild.id }).onConflictDoNothing();
});

export const guildDeleteSignal = new Signal(Signals.GuildDelete);

execute(guildDeleteSignal, async (guild) => {
  await db.delete(guildTable).where(eq(guildTable.id, guild.id));
});

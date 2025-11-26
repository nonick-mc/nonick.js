import { guild as guildTable } from '@repo/database';
import { eq } from 'drizzle-orm';
import { execute, Signal, Signals } from 'sunar';
import { db } from '@/lib/drizzle.js';

export const guildCreateSignal = new Signal(Signals.GuildCreate);

execute(guildCreateSignal, (guild) => {
  db.insert(guildTable).values({ id: guild.id }).onConflictDoNothing();
});

export const guildDeleteSignal = new Signal(Signals.GuildDelete);

execute(guildDeleteSignal, (guild) => {
  db.delete(guildTable).where(eq(guildTable.id, guild.id));
});

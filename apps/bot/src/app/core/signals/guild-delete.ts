import { guild } from '@repo/database';
import { Events } from 'discord.js';
import { eq } from 'drizzle-orm';
import { execute, Signal } from 'sunar';
import { db } from '@/src/lib/db';

export const guildDeleteSignal = new Signal(Events.GuildDelete);

execute(guildDeleteSignal, async ({ id }) => {
  await db.delete(guild).where(eq(guild.id, id));
});

import { guild } from '@repo/database';
import { Events } from 'discord.js';
import { eq } from 'drizzle-orm';
import { db } from '@/modules/drizzle';
import { DiscordEventBuilder } from '@/modules/events';

const onGuildCreate = new DiscordEventBuilder({
  type: Events.GuildCreate,
  async execute(apiGuild) {
    await db.insert(guild).values({ id: apiGuild.id }).onConflictDoNothing();
  },
});

const onGuildDelete = new DiscordEventBuilder({
  type: Events.GuildDelete,
  async execute(apiGuild) {
    await db.delete(guild).where(eq(guild.id, apiGuild.id));
  },
});

export default [onGuildCreate, onGuildDelete];

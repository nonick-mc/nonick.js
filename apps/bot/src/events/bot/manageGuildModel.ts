import { guild } from '@database/src/schema/guild';
import { db } from '@modules/drizzle';
import { DiscordEventBuilder } from '@modules/events';
import { Events } from 'discord.js';
import { eq } from 'drizzle-orm';

const GuildCache = new Set<string>();

const onGuildCreate = new DiscordEventBuilder({
  type: Events.GuildCreate,
  async execute(guild) {
    createGuild(guild.id);
  },
});

const onMessageCreate = new DiscordEventBuilder({
  type: Events.MessageCreate,
  async execute(message) {
    if (!message.inGuild()) return;
    createGuild(message.guild.id);
  },
});

const onGuildDelete = new DiscordEventBuilder({
  type: Events.GuildDelete,
  async execute(apiGuild) {
    db.delete(guild)
      .where(eq(guild.id, apiGuild.id))
      .then(() => {
        GuildCache.delete(apiGuild.id);
      });
  },
});

async function createGuild(guildId: string) {
  const dbGuild = await db.query.guild.findFirst({
    where: (setting, { eq }) => eq(setting.id, guildId),
  });

  if (GuildCache.has(guildId) || dbGuild) return;
  await db
    .insert(guild)
    .values({ id: guildId })
    .then(() => GuildCache.add(guildId));
}

export default [onGuildCreate, onMessageCreate, onGuildDelete];

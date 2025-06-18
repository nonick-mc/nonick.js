import { Events } from 'discord.js';
import { joinAndLeaveHolder } from '@/constants/holder';
import { db } from '@/modules/drizzle';
import { DiscordEventBuilder } from '@/modules/events';

export default new DiscordEventBuilder({
  type: Events.GuildMemberRemove,
  async execute(member) {
    const setting = await db.query.leaveMessageSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, member.guild.id),
    });
    if (!setting?.enabled) return;
    if (setting.ignoreBot && member.user.bot) return;
    const channel = setting.channel
      ? await member.guild.channels.fetch(setting.channel).catch(() => null)
      : null;
    if (channel?.isTextBased()) {
      channel.send(
        joinAndLeaveHolder.parse(setting.message, {
          guild: member.guild,
          user: member.user,
        }),
      );
    }
  },
});

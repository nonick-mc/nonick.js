import { ChatInput } from '@akki256/discord-interaction';
import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  hyperlink,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import { dashboard } from '@/constants/links';
import { db } from '@/modules/drizzle';
import { getBoost, getLevelDataWithRank, getNeedXP } from '@/modules/level';

const getLevelData = new ChatInput(
  {
    name: 'getleveldata',
    description: 'メンバーのレベルデータを取得',
    options: [
      {
        name: 'user',
        description: '対象',
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const setting = await db.query.levelSystemSettings.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });

    if (!setting || !setting.enabled) {
      return interaction.reply({
        content: `\`❌\` このコマンドを使用するためには、ダッシュボードで${hyperlink('レベルシステムを有効', `<${dashboard}/guilds/${interaction.guild.id}/levels>`)}にする必要があります。`,
        flags: [MessageFlags.Ephemeral],
      });
    }

    const user = interaction.options.getUser('user', true);
    const data = await getLevelDataWithRank(interaction.guildId, user.id);

    if (!data) {
      return interaction.reply({
        content: '`🔍` データがありません',
        flags: [MessageFlags.Ephemeral],
      });
    }

    const member = await interaction.guild.members.fetch(user).catch(console.error);

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle('レベルデータ')
          .setThumbnail(user.displayAvatarURL())
          .addFields(
            { name: '対象', value: `${user} (\`${user.username}\`)`, inline: true },
            { name: 'ランク', value: `${data.rank}`, inline: true },
            { name: 'レベル', value: `${data.level}`, inline: true },
            { name: '経験値', value: `${data.xp}`, inline: true },
            { name: '必要経験値', value: `${getNeedXP(data.level)}`, inline: true },
            {
              name: 'ブースト率',
              value: `${member ? (getBoost(member, setting.boosts, setting.globalBoost) ?? 1) : '取得不可'}`,
              inline: true,
            },
            { name: 'ユーザーブースト率', value: `${data.boost ?? 1}`, inline: true },
          ),
      ],
      flags: [MessageFlags.Ephemeral],
    });
  },
);

export default [getLevelData];

import { ChatInput } from '@akki256/discord-interaction';
import { ApplicationCommandOptionType, AttachmentBuilder, MessageFlags } from 'discord.js';
import { db } from '@/modules/drizzle';
import { createRankCard } from '@/modules/level';

export default new ChatInput(
  {
    name: 'rank',
    description: '現在のレベルを表示',
    options: [
      {
        name: 'user',
        description: '参照するユーザー',
        type: ApplicationCommandOptionType.User,
      },
      {
        name: 'public',
        description: 'コマンドの実行結果を他の人も閲覧できるようにするか',
        type: ApplicationCommandOptionType.Boolean,
      },
    ],
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const user = interaction.options.getUser('user') ?? interaction.user;
    const isPublic = interaction.options.getBoolean('public') ?? false;
    const member = await interaction.guild?.members.fetch(user);

    await interaction.deferReply({ flags: isPublic ? [] : [MessageFlags.Ephemeral] });

    try {
      if (!member) throw new ReferenceError('Wrong type of GuildMember');

      const levelData = await db.query.levels.findFirst({
        where: (data, { eq, and }) =>
          and(eq(data.guildId, interaction.guildId), eq(data.userId, user.id)),
      });
      if (!levelData) throw new ReferenceError('Missing Data');

      // ランクカードの作成
      // 引数に合わせてephemeral属性を切り替える
      interaction.editReply({
        files: [new AttachmentBuilder(await createRankCard(member), { name: 'rank-card.jpeg' })],
      });
    } catch {
      interaction.editReply({ content: '`🔍` データがありません' });
    }
  },
);

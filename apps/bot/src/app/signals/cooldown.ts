import { inlineCode, MessageFlags } from 'discord.js';
import { execute, Signal, Signals } from 'sunar';
import { getBotEmoji, warning } from '@/constants/emojis.js';

export const signal = new Signal(Signals.Cooldown);

execute(signal, async (interaction, context) => {
  interaction.reply({
    content: `${getBotEmoji(warning.circleAlert)} コマンドはクールダウン中です。${inlineCode(Math.floor(context.remaining / 1000).toString())}秒後に再試行してください。`,
    flags: [MessageFlags.Ephemeral],
  });
});

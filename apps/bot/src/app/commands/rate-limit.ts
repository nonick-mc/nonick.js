import {
  ApplicationCommandOptionType,
  inlineCode,
  MessageFlags,
  PermissionFlagsBits,
} from 'discord.js';
import { CooldownScope, config, execute, Slash } from 'sunar';
import { danger, getBotEmoji, success } from '@/constants/emojis.js';
import { missingPermissionMessage } from '@/lib/messages.js';

export const slash = new Slash({
  name: 'ratelimit',
  description: 'このチャンネルの低速モードを設定',
  options: [
    {
      name: 'duration',
      description: '秒数',
      minValue: 0,
      maxValue: 21600,
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  dmPermission: false,
  defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
});

config(slash, {
  cooldown: {
    time: 10_000,
    scope: CooldownScope.Channel,
  },
});

execute(slash, (interaction) => {
  if (!interaction.inGuild() || !interaction.channel?.isSendable()) return;

  if (interaction.channel.isVoiceBased()) {
    return interaction.reply({
      content: `${getBotEmoji(danger.circleX)} ボイスチャンネルでは低速モードを設定することはできません。`,
      flags: [MessageFlags.Ephemeral],
    });
  }

  const requirePermission = PermissionFlagsBits.ViewChannel | PermissionFlagsBits.ManageChannels;

  if (!interaction.appPermissions.has(requirePermission)) {
    return interaction.reply({
      content: missingPermissionMessage(interaction.appPermissions.missing(requirePermission)),
      flags: [MessageFlags.Ephemeral],
    });
  }

  const duration = interaction.options.getInteger('duration', true);

  interaction.channel
    .setRateLimitPerUser(duration, `/ratelimit by ${interaction.user.tag}`)
    .then(() => {
      interaction.reply({
        content: `${getBotEmoji(success.circleCheck)} チャンネルの低速モードを${inlineCode(duration.toString())}秒に設定しました。`,
        flags: [MessageFlags.Ephemeral],
      });
    })
    .catch(() => {
      interaction.reply({
        content: `${getBotEmoji(danger.circleX)} 低速モードの設定に失敗しました。`,
        flags: [MessageFlags.Ephemeral],
      });
    });
});

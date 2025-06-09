import { ChatInput } from '@akki256/discord-interaction';
import { dashboard } from '@const/links';
import { db } from '@modules/drizzle';
import { permissionField } from '@modules/fields';
import { permToText } from '@modules/util';
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  PermissionFlagsBits,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  hyperlink,
  inlineCode,
  roleMention,
} from 'discord.js';

const createCommand = new ChatInput(
  {
    name: 'create',
    description: '一部機能に使用するメッセージを送信',
    options: [
      {
        name: 'verify-panel',
        description: 'ロールを使用した認証パネルを作成',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: 'description',
            description: '埋め込みの説明文 (半角スペース2つで改行)',
            type: ApplicationCommandOptionType.String,
            maxLength: 4096,
          },
          {
            name: 'color',
            description: '埋め込みの色',
            type: ApplicationCommandOptionType.Number,
            choices: [
              { name: '🔴赤色', value: Colors.Red },
              { name: '🟠橙色', value: Colors.Orange },
              { name: '🟡黄色', value: Colors.Yellow },
              { name: '🟢緑色', value: Colors.Green },
              { name: '🔵青色', value: Colors.Blue },
              { name: '🟣紫色', value: Colors.Purple },
              { name: '⚪白色', value: Colors.White },
              { name: '⚫黒色', value: Colors.DarkButNotBlack },
            ],
          },
          {
            name: 'image',
            description: '画像',
            type: ApplicationCommandOptionType.Attachment,
          },
        ],
      },
    ],
    defaultMemberPermissions: [PermissionFlagsBits.ManageGuild],
    dmPermission: false,
  },
  async (interaction) => {
    if (!interaction.inCachedGuild()) return;

    const setting = await db.query.verificationSetting.findFirst({
      where: (setting, { eq }) => eq(setting.guildId, interaction.guildId),
    });
    if (!setting || !setting.enabled || !setting.role) {
      return interaction.reply({
        content: `${inlineCode(
          '❌',
        )} この機能を使用するには、${hyperlink('ダッシュボード', `<${dashboard}/guilds/${interaction.guild.id}/verification>`)}で設定を有効にする必要があります。`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      !interaction.guild.members.me?.permissions.has(
        PermissionFlagsBits.ManageRoles,
      )
    ) {
      return interaction.reply({
        content: permissionField(permToText('ManageRoles'), {
          label: 'BOTの権限が不足しています',
        }),
        flags: MessageFlags.Ephemeral,
      });
    }
    if (
      !interaction.channel
        ?.permissionsFor(interaction.client.user)
        ?.has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
        ])
    ) {
      return interaction.reply({
        content: `${inlineCode(
          '❌',
        )} BOTの権限が不足しているため、このチャンネルにメッセージを送信できませんでした。`,
        flags: MessageFlags.Ephemeral,
      });
    }

    const inputDescription = interaction.options.getString('description');
    const inputImage = interaction.options.getAttachment('image');
    const inputColor = interaction.options.getNumber('color');

    const container = new ContainerBuilder()
      .addTextDisplayComponents([
        new TextDisplayBuilder().setContent('## 認証'),
      ])
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setSpacing(SeparatorSpacingSize.Small)
          .setDivider(false),
      )
      .addTextDisplayComponents([
        new TextDisplayBuilder().setContent(
          inputDescription
            ? inputDescription.replace('  ', '\n')
            : `下の「認証」ボタンを押して認証を行ってください。\n認証が完了すると、${roleMention(setting.role)}が付与されます。`,
        ),
      ])
      .addSeparatorComponents(
        new SeparatorBuilder()
          .setSpacing(SeparatorSpacingSize.Small)
          .setDivider(false),
      );

    if (inputImage) {
      container
        .addMediaGalleryComponents([
          new MediaGalleryBuilder().addItems(
            new MediaGalleryItemBuilder().setURL(inputImage.url),
          ),
        ])
        .addSeparatorComponents(
          new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(false),
        );
    }

    if (inputColor) {
      container.setAccentColor(inputColor);
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    interaction.channel
      .send({
        components: [
          container.addActionRowComponents(
            new ActionRowBuilder<ButtonBuilder>().setComponents([
              new ButtonBuilder()
                .setCustomId('nonick-js:verify')
                .setLabel('認証')
                .setStyle(ButtonStyle.Success),
            ]),
          ),
        ],
        flags: MessageFlags.IsComponentsV2,
        allowedMentions: { parse: [] },
      })
      .then(() =>
        interaction.followUp({
          content: '`✅` 認証パネルを作成しました！',
        }),
      )
      .catch(() =>
        interaction.followUp({
          content:
            '`❌` 認証パネルの送信中に問題が発生しました。時間をおいて再度送信してください。',
        }),
      );
  },
);

export default [createCommand];

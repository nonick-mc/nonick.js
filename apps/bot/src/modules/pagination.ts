import { Duration } from '@modules/format';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from 'discord.js';
import type {
  ButtonInteraction,
  ComponentEmojiResolvable,
  EmbedBuilder,
  Interaction,
  InteractionReplyOptions,
  Message,
  MessageCollectorOptionsParams,
  MessageCreateOptions,
  TextBasedChannel,
} from 'discord.js';

type PaginationButtonFunc = (
  this: EmbedPagination,
  interaction: ButtonInteraction,
) => void;

export class PaginationButton {
  private readonly builder: ButtonBuilder;
  constructor(
    public readonly id: string,
    private exec?: PaginationButtonFunc,
  ) {
    this.builder = new ButtonBuilder().setCustomId(id);
  }

  setEmoji(emoji: ComponentEmojiResolvable) {
    this.builder.setEmoji(emoji);
    return this;
  }

  setLabel(label: string) {
    this.builder.setLabel(label);
    return this;
  }

  setStyle(style: ButtonStyle) {
    this.builder.setStyle(style);
    return this;
  }

  setDisabled(disabled?: boolean) {
    this.builder.setDisabled(disabled);
    return this;
  }

  setFunc(exec?: PaginationButtonFunc) {
    this.exec = exec;
    return this;
  }

  get func() {
    return this.exec ?? (() => {});
  }

  get buttonBuilder() {
    return this.builder;
  }
}

export class EmbedPagination {
  private pages: EmbedBuilder[];
  private readonly buttons: PaginationButton[];
  private current: number;
  private senderOnly: boolean;
  private sended: boolean;

  constructor(...pages: EmbedBuilder[]) {
    this.pages = pages;
    this.buttons = [];
    this.current = 0;
    this.senderOnly = true;
    this.sended = false;
  }

  private sendedTest() {
    if (this.sended) throw new Error('This message sended!');
  }

  private createCollectorOption(): MessageCollectorOptionsParams<ComponentType.Button> {
    return {
      filter: (i) => this.buttons.flat().some((b) => b.id === i.customId),
      componentType: ComponentType.Button,
      time: Duration.toMS('5m'),
    };
  }

  private createMessageOption<
    T extends MessageCreateOptions | InteractionReplyOptions,
  >(options: T): T {
    return {
      ...options,
      embeds: [...(options.embeds || []), this.pages[this.current]],
      components: [
        ...(options.components || []),
        ...this.buttons.reduce<ActionRowBuilder<ButtonBuilder>[]>((p, c, i) => {
          const index = Math.floor(i / 5);
          const row = p[index] ?? new ActionRowBuilder();
          p[index] = row.addComponents(c.buttonBuilder);
          return p;
        }, []),
      ],
    };
  }

  private setFooter() {
    this.pages = this.pages.map((em, i) =>
      em.setFooter({
        text: `${
          em.data.footer?.text ? `${em.data.footer?.text} | ` : ''
        }Page ${i + 1} / ${this.pages.length}`,
        iconURL: em.data.footer?.icon_url,
      }),
    );
  }

  private sendSetup() {
    if (!this.pages.length) throw new Error('page length 0');
    if (!this.buttons.length) {
      this.addButtons(
        EmbedPagination.previousButton,
        EmbedPagination.nextButton,
      );
    }
    this.setFooter();
    this.sended = true;
  }

  useSenderOnly(only: boolean) {
    this.sendedTest();
    this.senderOnly = only;
    return this;
  }

  addPages(...pages: EmbedBuilder[]) {
    this.sendedTest();
    this.pages.push(...pages);
    return this;
  }

  addButtons(...buttons: PaginationButton[]) {
    this.sendedTest();
    this.buttons.push(...buttons);
    return this;
  }

  async setPage(interaction: ButtonInteraction, index: number) {
    const page = this.pages[index];
    if (!page)
      throw new RangeError(
        `index must be between 0 and ${this.pages.length - 1}`,
      );
    this.current = index;
    await interaction.editReply({ embeds: [page] });
  }

  async previousPage(interaction: ButtonInteraction) {
    const index = this.current - 1;
    await this.setPage(interaction, index < 0 ? this.pageCount + index : index);
  }

  async nextPage(interaction: ButtonInteraction) {
    const index = this.current + 1;
    await this.setPage(
      interaction,
      index >= this.pageCount ? index - this.pageCount : index,
    );
  }

  async sendMessage(
    channel: TextBasedChannel,
    options: MessageCreateOptions = {},
    message?: Message,
  ) {
    this.sendSetup();
    if (!channel.isSendable()) return;
    const msg = await channel.send(this.createMessageOption(options));

    const collector = msg.createMessageComponentCollector(
      this.createCollectorOption(),
    );

    collector.on('collect', async (i) => {
      if (message && this.senderOnly && !i.user.equals(message.author)) return;
      collector.resetTimer();

      const button = this.buttons.find((b) => b.id === i.customId);
      if (!button) return;
      await i.deferUpdate();
      button.func.call(this, i);
    });
  }

  async replyMessage(message: Message, options: MessageCreateOptions = {}) {
    options.reply = {
      messageReference: options.reply?.messageReference ?? message,
      failIfNotExists: options.reply?.failIfNotExists,
    };
    await this.sendMessage(message.channel, options, message);
  }

  async replyInteraction(
    interaction: Interaction,
    options: InteractionReplyOptions = {},
  ) {
    if (!interaction.isRepliable()) throw new Error("interaction can't reply");
    this.sendSetup();
    const msg = await interaction.reply(this.createMessageOption(options));

    const collector = msg.createMessageComponentCollector(
      this.createCollectorOption(),
    );

    collector.on('collect', async (i) => {
      if (this.senderOnly && !i.user.equals(interaction.user)) return;
      collector.resetTimer();

      const button = this.buttons.find((b) => b.id === i.customId);
      if (!button) return;
      await i.deferUpdate();
      button.func.call(this, i);
    });
  }

  get currentPage() {
    return this.current;
  }

  get pageCount() {
    return this.pages.length;
  }

  static get previousButton() {
    return new PaginationButton('pagination:previous')
      .setEmoji('◀️')
      .setStyle(ButtonStyle.Secondary)
      .setFunc(function (i) {
        this.previousPage(i);
      });
  }

  static get nextButton() {
    return new PaginationButton('pagination:next')
      .setEmoji('▶')
      .setStyle(ButtonStyle.Secondary)
      .setFunc(function (i) {
        this.nextPage(i);
      });
  }
}

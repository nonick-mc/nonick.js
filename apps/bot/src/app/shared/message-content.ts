import {
  type AttachmentBuilder,
  type ContainerBuilder,
  FileBuilder,
  type Message,
  TextDisplayBuilder,
} from 'discord.js';
import { createAttachment, createJsonAttachment } from '@/src/lib/utils';

// メッセージの内容（本文・添付ファイル・埋め込み・コンポーネント）をcontainerに追加する
export async function addMessageContent(
  container: ContainerBuilder,
  message: Message,
  filePrefix = '',
) {
  const attachment = message.attachments.size
    ? await createAttachment(message.attachments)
    : undefined;
  attachment?.setName(`${filePrefix}${attachment.name ?? 'attachments.zip'}`);
  const embedsAttachment = message.embeds.length
    ? createJsonAttachment(message.embeds, `${filePrefix}embeds.json`)
    : undefined;
  const componentsAttachment = message.components.length
    ? createJsonAttachment(message.components, `${filePrefix}components.json`)
    : undefined;
  const files = [attachment, embedsAttachment, componentsAttachment].filter(
    (f): f is AttachmentBuilder => f !== undefined,
  );

  if (message.content)
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(message.content));
  for (const file of files) {
    container.addFileComponents(new FileBuilder().setURL(`attachment://${file.name}`));
  }

  return files;
}

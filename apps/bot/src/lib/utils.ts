import AdmZip from 'adm-zip';
import axios from 'axios';
import type { Attachment } from 'discord.js';
import { AttachmentBuilder, type Collection } from 'discord.js';

export async function createAttachment(attachments: Collection<string, Attachment>) {
  if (!attachments.size) return;
  const zip = new AdmZip();
  for await (const attachment of attachments.values()) {
    const res = await axios.get(attachment.url, { responseType: 'arraybuffer' }).catch(() => null);
    if (!res) continue;
    zip.addFile(attachment.name, res.data);
  }
  return new AttachmentBuilder(zip.toBuffer(), { name: 'attachments.zip' });
}

export function createJsonAttachment(data: unknown, name: string) {
  return new AttachmentBuilder(Buffer.from(JSON.stringify(data, null, 2)), { name });
}

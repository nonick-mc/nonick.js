import { unorderedList } from 'discord.js';

export function unorderedListTable(data: { label: string; value: string }[]) {
  return unorderedList(data.map((v) => `${v.label}: ${v.value}`));
}

/** 指定の長さを超える文字列を「...」で省略する */
export function truncateString(str: string, maxLength: number): string {
  if (str.length > maxLength) return `${str.substring(0, maxLength)}...`;
  return str;
}

/** 任意の間待機する */
export async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

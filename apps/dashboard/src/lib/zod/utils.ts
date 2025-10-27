/** 配列内の要素が重複していないかを確認する */
export const isUniqueArray = <T>(array: T[]): boolean => array.length === new Set(array).size;

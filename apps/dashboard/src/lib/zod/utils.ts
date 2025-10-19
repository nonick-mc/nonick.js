export const isUniqueArray = <T>(array: T[]): boolean => array.length === new Set(array).size;

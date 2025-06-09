export function isUniqueArray(items: unknown[]) {
  return items.length === new Set(items).size;
}

export function validateObject(obj: unknown): Record<string, unknown> | undefined {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return undefined;
  }
  return Object.keys(obj).length > 0 ? (obj as Record<string, unknown>) : undefined;
}

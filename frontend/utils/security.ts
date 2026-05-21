type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

/**
 * Sanitizes JSON-LD to prevent script injection attacks.
 */
export function sanitizeJsonLd<T extends Record<string, JSONValue>>(data: T): string {
  if (!data) return "{}";
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}


export function parseJsonStrict<T>(text: string): T {
  return JSON.parse(text) as T;
}

export function safeRepairJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1);
  return text;
}

export async function parseWithRetry<T>(runner: () => Promise<string>): Promise<T> {
  let raw = await runner();
  try {
    return parseJsonStrict<T>(raw);
  } catch {
    raw = safeRepairJson(raw);
    return parseJsonStrict<T>(raw);
  }
}

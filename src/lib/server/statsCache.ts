const cache = new Map<string, { data: unknown; ts: number }>();
const TTL = 5 * 60 * 1000;

export function getCachedStats<T>(key: string): { data: T; ts: number } | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > TTL) {
    cache.delete(key);
    return null;
  }
  return entry as { data: T; ts: number };
}

export function setCachedStats<T>(key: string, data: T): number {
  const ts = Date.now();
  cache.set(key, { data, ts });
  return ts;
}

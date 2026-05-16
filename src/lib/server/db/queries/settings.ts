import { db } from '../db';
import { settings } from '../schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string): Promise<string | null> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  return db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } })
    .execute();
}

export async function isStatsEnabled(): Promise<boolean> {
  try {
    const val = await getSetting('statsEnabled');
    return val !== 'false';
  } catch {
    // Table doesn't exist yet (migration pending) — default to enabled
    return true;
  }
}

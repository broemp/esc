import { db } from '../db';
import { settings } from '../schema';
import { eq } from 'drizzle-orm';

export async function getSetting(key: string): Promise<string | null> {
  const rows = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  await db
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
    return true;
  }
}

export async function isVotingLocked(): Promise<boolean> {
  try {
    const val = await getSetting('votingLocked');
    return val === 'true';
  } catch {
    return false;
  }
}

export async function getActiveYear(): Promise<number> {
  try {
    const val = await getSetting('activeYear');
    return val ? parseInt(val, 10) : new Date().getFullYear();
  } catch {
    return new Date().getFullYear();
  }
}

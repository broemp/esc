import { and, asc, desc, eq, or, sql } from 'drizzle-orm';
import { db } from '../db';
import { acts, countries, votes, users } from '../schema';
import { createInsertSchema } from 'drizzle-zod';
import type { Act, NewAct } from '../../../types';

const insertActSchema = createInsertSchema(acts);

export function getAct(id: string) {
  return db
    .select()
    .from(acts)
    .where(eq(acts.id, id))
    .leftJoin(countries, eq(acts.countryID, countries.id))
    .limit(1);
}

export function updateAct(act: Act) {
  insertActSchema.parse(act);
  return db.update(acts).set(act).where(eq(acts.id, act.id)).returning().execute();
}

export function deleteAct(actID: string) {
  return db.delete(acts).where(eq(acts.id, actID)).execute()
}

export function listActs(limit: number, offset: number) {
  return db
    .select()
    .from(acts)
    .innerJoin(countries, eq(acts.countryID, countries.id))
    .limit(limit)
    .offset(offset)
    .orderBy(asc(acts.position));
}

export async function nextAdminAct() {
  let votedOn = await db.select().from(acts)
    .innerJoin(votes, eq(votes.actID, acts.id))
    .innerJoin(users, and(eq(users.id, votes.userID), eq(users.role, 'admin')))
    .orderBy(desc(acts.position))

  if (votedOn.length > 0) {
    let lastVote = votedOn[0].act.position!
    return db.select().from(acts).where(eq(acts.position, lastVote + 1)).limit(1)
  }

  return db.select().from(acts).where(eq(acts.position, 1)).limit(1)
}

export function createAct(newAct: NewAct) {
  return db.insert(acts).values(newAct).onConflictDoNothing().execute();
}

export function getAdjacentActs(actPosition: number) {
  return db.select().from(acts)
    .where(or(eq(acts.position, actPosition - 1), eq(acts.position, actPosition + 1)))
    .orderBy(asc(acts.position));
}

export function getCurrentTopActs(limit: number, offset: number) {
  return db
    .select({
      actID: acts.id,
      artist: acts.artist,
      title: acts.title,
      countryImage: countries.imageURL,
      score: sql<number>`cast(avg(${votes.points}) AS DECIMAL(10,2))`
    })
    .from(votes)
    .leftJoin(acts, eq(acts.id, votes.actID))
    .leftJoin(countries, eq(countries.id, acts.countryID))
    .groupBy(acts.id, acts.artist, acts.title, countries.imageURL)
    .orderBy(desc(sql<number>`avg(${votes.points})`))
    .limit(limit)
    .offset(offset);
} 
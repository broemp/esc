import { and, desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { votes, acts, countries, categories } from '../schema';
import { createInsertSchema } from 'drizzle-zod';
import type { Vote, NewVote } from '../../../types';

const insertVoteSchema = createInsertSchema(votes);

export function createVote(newVote: NewVote) {
  insertVoteSchema.parse(newVote);
  return db.insert(votes)
    .values(newVote)
    .onConflictDoUpdate({
      target: [votes.userID, votes.actID, votes.categories],
      set: { points: newVote.points }
    })
    .execute();
}

export function getVoteForActByUser(userId: string, actId: string) {
  return db.select().from(votes).where(and(eq(votes.userID, userId), eq(votes.actID, actId)));
}

export function getUserVotes(userId: string) {
  return db
    .select({
      points: votes.points,
      act: {
        id: acts.id,
        artist: acts.artist,
        title: acts.title,
        picture_url: acts.picture_url
      },
      country: {
        imageURL: countries.imageURL
      },
      category: {
        name: categories.name
      }
    })
    .from(votes)
    .where(eq(votes.userID, userId))
    .leftJoin(acts, eq(votes.actID, acts.id))
    .leftJoin(countries, eq(acts.countryID, countries.id))
    .leftJoin(categories, eq(votes.categories, categories.id))
    .orderBy(desc(votes.points));
}

export function deleteAllVotes() {
  return db.delete(votes).execute();
} 
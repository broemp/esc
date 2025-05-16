import { db } from '$lib/server/db/db';
import { votes, users, acts, categories } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  const allVotes = await db
    .select({
      vote: votes,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image
      },
      act: {
        id: acts.id,
        artist: acts.artist,
        title: acts.title
      },
      category: {
        id: categories.id,
        name: categories.name
      }
    })
    .from(votes)
    .leftJoin(users, eq(votes.userID, users.id))
    .leftJoin(acts, eq(votes.actID, acts.id))
    .leftJoin(categories, eq(votes.categories, categories.id))
    .orderBy(desc(votes.created_at));

  return {
    votes: allVotes
  };
}; 
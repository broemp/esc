import { db } from '$lib/server/db/db';
import { votes, users, acts, categories } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  const page = Number(url.searchParams.get('page')) || 1;
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  const [allVotes, totalCount] = await Promise.all([
    db
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
      .orderBy(desc(votes.created_at))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: votes.userID })
      .from(votes)
      .then((result) => result.length)
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    votes: allVotes,
    pagination: {
      currentPage: page,
      totalPages,
      pageSize,
      totalCount
    }
  };
}; 
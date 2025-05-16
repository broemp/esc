import { deleteAllVotes } from '$lib/server/db/queries';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async (request: RequestEvent) => {
  const session = await request.locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  try {
    await deleteAllVotes();
    return new Response(null, { status: 200 });
  } catch (err) {
    throw error(500, 'Failed to delete votes');
  }
}; 
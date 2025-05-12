import { db } from '$lib/server/db/db';
import { groups } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (request: RequestEvent) => {
  const session = await request.locals.auth();
  const userID = session?.user?.id;
  
  if (!userID || !request.params.id) {
    throw error(400, 'Invalid request');
  }

  // Verify user is admin
  const group = await db.select().from(groups).where(eq(groups.id, request.params.id)).limit(1);
  if (!group[0] || group[0].admin !== userID) {
    throw error(403, 'Not authorized');
  }

  const data = await request.request.json();
  const { name, public: isPublic } = data;

  if (!name || typeof isPublic !== 'boolean') {
    throw error(400, 'Invalid data');
  }

  await db
    .update(groups)
    .set({ name, public: isPublic })
    .where(eq(groups.id, request.params.id))
    .execute();

  return new Response(null, { status: 200 });
}; 
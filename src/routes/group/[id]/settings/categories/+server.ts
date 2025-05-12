import { db } from '$lib/server/db/db';
import { groups, categoriesInGroup } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import type { RequestHandler } from './$types';
import { addCategorieToGroup, getGroupCategories } from '$lib/server/db/queries';

async function verifyAdmin(request: RequestEvent) {
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

  return userID;
}

export const GET: RequestHandler = async (request: RequestEvent) => {
  await verifyAdmin(request);
  const categories = await getGroupCategories(request.params.id!);
  
  return new Response(JSON.stringify(categories), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const POST: RequestHandler = async (request: RequestEvent) => {
  await verifyAdmin(request);

  const data = await request.request.json();
  const { categories } = data;

  if (!Array.isArray(categories)) {
    throw error(400, 'Invalid data');
  }

  // Remove all existing categories
  await db
    .delete(categoriesInGroup)
    .where(eq(categoriesInGroup.groupId, request.params.id))
    .execute();

  // Add new categories
  for (const category of categories) {
    await addCategorieToGroup(category, request.params.id!);
  }

  return new Response(null, { status: 200 });
}; 
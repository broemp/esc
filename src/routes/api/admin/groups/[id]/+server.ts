import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getMembersOfGroup, getGroupCategories } from '$lib/server/db/queries';

export const GET: RequestHandler = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  const { id } = params;

  const [members, groupCategories] = await Promise.all([
    getMembersOfGroup(id),
    getGroupCategories(id)
  ]);

  return json({
    members,
    categories: groupCategories.map((r) => r.category)
  });
};

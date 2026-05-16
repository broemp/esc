import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteCategory, getGroupsForCategory } from '$lib/server/db/queries';

export const GET: RequestHandler = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }
  const { id } = params;
  const groups = await getGroupsForCategory(id);
  return json(groups);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }
  const { id } = params;
  const result = await deleteCategory(id);
  return json(result);
}; 
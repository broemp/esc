import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteCategory } from '$lib/server/db/queries';

export const DELETE: RequestHandler = async ({ params }) => {
  const { id } = params;
  const result = await deleteCategory(id);
  return json(result);
}; 
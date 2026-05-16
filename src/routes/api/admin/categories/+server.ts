import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { newCategory, updateCategory } from '$lib/server/db/queries';
import type { Category } from '$lib/types';

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }
  const category: Category = await request.json();
  const result = await newCategory(category);
  return json(result);
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }
  const category: Category = await request.json();
  const result = await updateCategory(category);
  return json(result);
}; 
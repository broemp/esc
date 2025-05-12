import { getAllCategories } from '$lib/server/db/queries';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const categories = await getAllCategories();
  return new Response(JSON.stringify(categories), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}; 
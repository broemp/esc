import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAllCategories, getTotalCategoriesCount } from '$lib/server/db/queries';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  const [categories, totalCount] = await Promise.all([
    getAllCategories(),
    getTotalCategoriesCount()
  ]);

  return {
    categories,
    totalCount: totalCount[0].count
  };
}; 
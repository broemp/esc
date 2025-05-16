import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAdminStats } from '$lib/server/db/queries/stats';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  const stats = await getAdminStats();

  return {
    stats
  };
}; 
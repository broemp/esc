import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { getAdminStats } from '$lib/server/db/queries/stats';
import { isStatsEnabled, setSetting } from '$lib/server/db/queries/settings';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  const [stats, statsEnabled] = await Promise.all([
    getAdminStats(),
    isStatsEnabled(), // safe — returns true if setting table not yet migrated
  ]);

  return { stats, statsEnabled };
};

export const actions = {
  toggleStats: async (event: RequestEvent) => {
    const session = await event.locals.auth();
    if (!session?.user || session.user.role !== 'admin') {
      throw error(403, 'Not authorized');
    }
    const current = await isStatsEnabled();
    await setSetting('statsEnabled', current ? 'false' : 'true');
    return { statsEnabled: !current };
  },
} satisfies Actions; 
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions, RequestEvent } from './$types';
import { getAdminStats } from '$lib/server/db/queries/stats';
import { isStatsEnabled, setSetting, isVotingLocked, getActiveYear } from '$lib/server/db/queries/settings';
import { z } from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  if (!session?.user || session.user.role !== 'admin') {
    throw error(403, 'Not authorized');
  }

  const [year, locked] = await Promise.all([getActiveYear(), isVotingLocked()]);
  const [stats, statsEnabled] = await Promise.all([
    getAdminStats(year),
    isStatsEnabled(),
  ]);

  return { stats, statsEnabled, votingLocked: locked, activeYear: year };
};

export const actions = {
  toggleStats: async (event: RequestEvent) => {
    const session = await event.locals.auth();
    if (!session?.user || session.user.role !== 'admin') {
      throw error(403, 'Not authorized');
    }
    try {
      const current = await isStatsEnabled();
      await setSetting('statsEnabled', current ? 'false' : 'true');
      return { statsEnabled: !current };
    } catch (e) {
      console.error('[toggleStats]', e);
      return fail(500, { error: 'Failed to update setting' });
    }
  },

  toggleVotingLocked: async (event: RequestEvent) => {
    const session = await event.locals.auth();
    if (!session?.user || session.user.role !== 'admin') {
      throw error(403, 'Not authorized');
    }
    try {
      const current = await isVotingLocked();
      await setSetting('votingLocked', current ? 'false' : 'true');
      return { votingLocked: !current };
    } catch (e) {
      console.error('[toggleVotingLocked]', e);
      return fail(500, { error: 'Failed to update setting' });
    }
  },

  setActiveYear: async (event: RequestEvent) => {
    const session = await event.locals.auth();
    if (!session?.user || session.user.role !== 'admin') {
      throw error(403, 'Not authorized');
    }
    const formData = await event.request.formData();
    const raw = formData.get('year');
    const parsed = z.coerce.number().int().min(2000).max(2100).safeParse(raw);
    if (!parsed.success) {
      return fail(400, { error: 'Invalid year' });
    }
    try {
      await Promise.all([
        setSetting('activeYear', parsed.data.toString()),
        // Unlock voting when starting a new year
        setSetting('votingLocked', 'false'),
      ]);
      return { activeYear: parsed.data, votingLocked: false };
    } catch (e) {
      console.error('[setActiveYear]', e);
      return fail(500, { error: 'Failed to update year' });
    }
  },
} satisfies Actions;

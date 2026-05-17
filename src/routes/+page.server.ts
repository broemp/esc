import {
  getCurrentTopActs,
  listActs,
  getGroupsFromUser,
  getPublicGroups,
  getUserStats,
  nextAdminAct,
  getActiveYear,
  isVotingLocked,
} from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.auth();
  const userId = session?.user?.id ?? null;

  const [year, locked] = await Promise.all([getActiveYear(), isVotingLocked()]);

  const [acts, topActs, publicGroups, currentAct] = await Promise.all([
    listActs(40, 0, year),
    getCurrentTopActs(10, 0, year),
    getPublicGroups(4, 0),
    nextAdminAct(year),
  ]);

  const [userGroups, userStats] = await Promise.all([
    userId ? getGroupsFromUser(userId) : Promise.resolve([]),
    userId ? getUserStats(userId, year) : Promise.resolve(null),
  ]);

  return {
    acts,
    topActs,
    groups: userGroups,
    publicGroups,
    userStats,
    currentAct: currentAct[0] ?? null,
    activeYear: year,
    votingLocked: locked,
  };
};

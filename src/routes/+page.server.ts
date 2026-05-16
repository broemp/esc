import { getCurrentTopActs, listActs, getGroupsFromUser, getPublicGroups, getUserStats } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.auth();
  const userId = session?.user?.id ?? null;

  const [acts, topActs, publicGroups] = await Promise.all([
    listActs(40, 0),
    getCurrentTopActs(10, 0),
    getPublicGroups(4, 0),
  ]);

  const [userGroups, userStats] = await Promise.all([
    userId ? getGroupsFromUser(userId) : Promise.resolve([]),
    userId ? getUserStats(userId) : Promise.resolve(null),
  ]);

  return {
    acts,
    topActs,
    groups: userGroups,
    publicGroups,
    userStats,
  };
};

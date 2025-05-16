import { getCurrentTopActs, listActs, getGroupsFromUser, getPublicGroups } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  let acts = listActs(40, 0);
  let topActs = getCurrentTopActs(10, 0);
  let session = await event.locals.auth();
  let userGroups = session?.user ? await getGroupsFromUser(session.user.id!) : [];
  let publicGroups = await getPublicGroups(4, 0);
  
  return {
    acts: await acts,
    topActs: await topActs,
    groups: userGroups,
    publicGroups: publicGroups
  };
};

import { getCurrentTopActs, listActs, getGroupsFromUser } from '$lib/server/db/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  let acts = listActs(40, 0);
  let topActs = getCurrentTopActs(10, 0);
  let session = await event.locals.auth();
  let groups = session?.user ? await getGroupsFromUser(session.user.id!) : [];
  
  return {
    acts: await acts,
    topActs: await topActs,
    groups: groups
  };
};

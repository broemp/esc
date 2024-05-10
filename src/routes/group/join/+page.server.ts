import { getPublicGroups, joinGroup } from '$lib/server/db/querys';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './[id]/$types';
import type { RequestEvent, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event: RequestEvent) => {
  let publicGroups = await getPublicGroups(10, 0)
  return {
    publicGroups: publicGroups
  }
}

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const auth = await event.locals.auth();

    const groupID = data.get('group_id')?.toString();
    const userID = auth?.user?.id?.toString();

    joinGroup({ groupId: groupID!, userId: userID! });

    return redirect(303, '/group/' + groupID);
  }
};
